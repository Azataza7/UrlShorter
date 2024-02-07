'use client';

import { Alert, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { shortUserUrl, userUrl } from '../types';
import axiosApi from '../axiosApi';

export default function Home() {

  const [userUrl, setUserUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [alertStatus, setAlertStatus] = useState(false);
  const URL = 'http://localhost:8000/links/' + shortUrl;

  const shortenMutation = useMutation<shortUserUrl, Error, userUrl>({
    mutationKey: 'links',
    mutationFn: async (data) => {
      const response = await axiosApi.post('/links', data);
      return response.data;
    },
    onSuccess: (data) => {
      setShortUrl(data.shortUrl);
      setAlertStatus(false);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const handleShortenUrl = async () => {
    try {
      if (userUrl.length > 0) {
        await shortenMutation.mutateAsync({originalUrl: userUrl});
      } else {
        setAlertStatus(true);
      }
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  const alert: JSX.Element = (
    <Alert
      sx={{
        display: alertStatus ? 'flex' : 'none',
        position: 'absolute', top: '7px', left: '35%', zIndex: '1000',
      }}
      variant="filled"
      severity="warning">
      Fill input before click button
    </Alert>
  );

  const shortUrlContainer: JSX.Element = (
    <Grid sx={{display: shortUrl ? 'block' : 'none', textAlign: 'center'}}>
      <Typography sx={{marginY: 2}} variant={'h6'}>Your link now looks like this:</Typography>
      <Link href={URL} variant="children" underline="hover">{URL}</Link>
    </Grid>
  );

  return (
    <main>
      {alert}
      <Grid container spacing={2} sx={{flexDirection: 'column', marginY: 6, textAlign: 'center'}}>
        <Grid item xs={12} md={12}>
          <Typography variant="h4">Shorten your link!</Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            label="URL Field"
            type="url"
            variant="outlined"
            value={userUrl}
            sx={{width: 500}}
            minRows={3}
            onChange={(e) => setUserUrl(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Button type="submit" variant="contained" onClick={handleShortenUrl}> Shorten!</Button>
        </Grid>
      </Grid>
      {shortUrlContainer}
    </main>
  );
}
