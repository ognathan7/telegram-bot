const axios = require('axios');
const crypto = require('crypto');

async function enviarEventoTikTok({ event, eventId, valor, produto, userId }) {
  try {
    await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/event/track/',
      {
        event_source: 'web',
        event_source_id: process.env.TIKTOK_PIXEL_ID,
        data: [
          {
            event,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            user: {
              external_id: crypto
                .createHash('sha256')
                .update(String(userId))
                .digest('hex')
            },
            properties: {
              value: valor,
              currency: 'BRL',
              content_name: produto
            }
          }
        ]
      },
      {
        headers: {
          'Access-Token': process.env.TIKTOK_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Evento TikTok enviado:', event);
  } catch (error) {
    console.log('Erro TikTok:', error.response?.data || error.message);
  }
}

module.exports = { enviarEventoTikTok };
