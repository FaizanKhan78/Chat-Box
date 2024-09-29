import { Box, Typography } from '@mui/material';
import { memo } from 'react';
import moment from "moment";
import { fileFormat } from '../../lib/features';
import RenderAttachment from './RenderAttachment';
import { useTheme } from '@emotion/react';

const Messages = ( { message, user } ) =>
{
  const { sender, content, attachments = [], createdAt } = message;

  const theme = useTheme();

  const timeAgo = moment( createdAt ).fromNow();
  const isUserMessage = sender?._id === user?._id;

  return (
    <div style={ { display: 'flex', flexDirection: 'column', alignItems: isUserMessage ? 'flex-end' : 'flex-start' } }>
      <span style={ { fontSize: '12px', color: '#888888', marginBottom: '5px' } }>
        { isUserMessage ? 'You' : <span style={ { fontWeight: 550 } }>{ sender?.name }</span> }, { timeAgo }
      </span>
      <div
        style={ {
          position: 'relative',
          backgroundColor: isUserMessage ? theme.palette.background.chat2 : theme.palette.background.chat,
          color: 'text.primary',
          padding: '10px 15px',
          borderRadius: '20px',
          maxWidth: '70%',
          margin: '5px 0',
          display: 'inline-block',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        } }
      >
        { content && <Typography sx={ { fontFamily: "hack" } }>{ content }</Typography> }

        {/* Tail for the message */ }
        {
          attachments.map( ( i ) =>
          {
            const url = i.url;
            const file = fileFormat( url );
            return (
              <Box key={ i }>
                <a href={ url } target='__blank' download style={ { color: "black" } }>
                  <RenderAttachment file={ file } url={ url } />
                </a>
              </Box>
            );
          } )
        }
        <div
          style={ {
            position: 'absolute',
            width: '25px',
            height: '25px',
            backgroundColor: isUserMessage ? theme.palette.background.chat2 : theme.palette.background.chat,
            bottom: '.5px',
            right: isUserMessage ? '-8px' : 'auto',
            left: isUserMessage ? 'auto' : '-8px',
            clipPath: isUserMessage ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(50% 0%, 0% 100%, 100% 100%)',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          } }
        ></div>
      </div>
    </div>
  );
};

export default memo( Messages );
