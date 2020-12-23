import { useState } from 'react';
import { Box, Button, Text } from 'theme-ui';

export const InvitePlayer = () => {
  const [message, setMessage] = useState('');

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Scopa',
          text: 'Come and play scopa with me',
          url: window.location.href,
        })
        .then(() => setMessage('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => setMessage('Link copied in the clipboard'))
        .catch((error) => console.log('Error copying', error));
    }
  };
  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      {message && <Text my={2}>{message}</Text>}
      <Text>Invite a player to join</Text>
      <Button onClick={share}>Share this game</Button>
    </Box>
  );
};
