import { Box, Button, Flex, Input } from 'theme-ui';
import { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { useUserData } from './UserContext';

export const Username = () => {
  const [editing, setEditing] = useState(false);
  const { username, setUsername } = useUserData();
  const [displayName, setDisplayName] = useState(username);
  if (editing) {
    return (
      <Flex
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          setUsername(displayName);
          setEditing(false);
        }}
      >
        <Box>
          <Input autoFocus required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </Box>
        <Box mx={2} />
        <Button type="submit">Edit</Button>
        <Box mx={2} />
        <Button variant="darkGrey" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </Flex>
    );
  }
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <strong>{username}</strong>
      <Box mx={2} />
      <Button variant="outline" sx={{ p: 1 }} onClick={() => setEditing(true)}>
        <FiEdit3 /> Update username
      </Button>
    </Flex>
  );
};
