import https from 'https';

https.get('https://auraafinance.vercel.app/signup', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
    if (match) {
      const jsUrl = 'https://auraafinance.vercel.app' + match[1];
      console.log('Found JS:', jsUrl);
      https.get(jsUrl, (jsRes) => {
        let jsData = '';
        jsRes.on('data', (chunk) => jsData += chunk);
        jsRes.on('end', () => {
          // Look for common API urls
          const apiMatch = jsData.match(/https?:\/\/[a-zA-Z0-9.-]+\/api\/v1/);
          if (apiMatch) {
            console.log('API URL in live bundle:', apiMatch[0]);
          } else {
            console.log('Could not find API URL in live bundle. Checking for localhost...');
            const localMatch = jsData.match(/http:\/\/localhost:5050\/api\/v1/);
            if (localMatch) {
              console.log('FOUND LOCALHOST in live bundle!');
            } else {
               // Check near the string auth/signup
               const signupIdx = jsData.indexOf('/auth/signup');
               if (signupIdx !== -1) {
                  console.log('Found /auth/signup. Context:', jsData.substring(signupIdx - 50, signupIdx + 50));
               }
            }
          }
        });
      });
    } else {
      console.log('Could not find JS file');
    }
  });
}).on('error', (err) => {
  console.error(err);
});
