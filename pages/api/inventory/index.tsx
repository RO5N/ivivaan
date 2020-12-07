const API_PATH = process.env.API_PATH;

export default async function userInventory(req: any, res: any) {
  const {
    query: { apikey, max, last },
    method,
  } = req;

  switch (method) {
    case 'GET':
      const results: any = await fetch(
        API_PATH + `/Asset/Asset/All?apikey=${apikey}&max=${max}&last=${last}`
      );
      console.log('results: ', results.status);

      if (results.status === 200) {
        const data = await results.json();
        console.log('data: ', data);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ data }));
      } else {
        res.statusCode = results.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ statusText: results.statusText }));
      }

      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
