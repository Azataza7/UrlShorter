'use client';

import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { shortUserUrl, userUrl } from '../types';
import axiosApi from '../axiosApi';

export default function Home() {
  const [userUrl, setUserUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const shortenMutation = useMutation<shortUserUrl, Error, userUrl>({
    mutationFn: async (data) => {
      const response = await axiosApi.post('/links', data);
      return response.data;
    },
    onSuccess: (data: shortUserUrl) => {
      setShortUrl(data.shortUrl);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const handleShortenUrl = async () => {
    try {
      await shortenMutation.mutateAsync({originalUrl: userUrl})
    } catch (e) {
      console.error('Error: ', e)
    }
  }


  const shortUrlContainer: JSX.Element = (
    <Grid>
      <Link>{shortUrl}</Link>
    </Grid>
  )

  return (
    <main>
      <Grid container spacing={2} sx={{flexDirection: 'column', marginTop: 5, textAlign: 'center'}}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4">Shorten your link!</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="URL Field"
            type="Url"
            variant="outlined"
            sx={{width: 500}}
            onChange={(e) => setUserUrl(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button type="submit" variant="contained" onClick={ handleShortenUrl }> Shorten!</Button>
        </Grid>
      </Grid>
      {shortUrlContainer}
    </main>
  );
}
