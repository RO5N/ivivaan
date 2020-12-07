import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { inventorySVC } from '../services';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chart from './Chart';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 60,
    },
    OperationalStatusSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    OperationalStatus: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginLeft: 50,
    },

    chart: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 80,
    },
  })
);

export default function Index() {
  const classes = useStyles();
  const [data, setData] = React.useState<any>([]);
  const max = 50;
  const [last, setLast] = React.useState<any>(0);
  const [dataReceived, setDataReceived] = React.useState<any>(false);
  const [categoryData, setCategoryData] = React.useState<any>([]);

  React.useEffect(() => {
    console.log('useEffect');
    var catData: any = categoryData;
    if (!dataReceived) {
      inventorySVC
        .getAssets(max, last)
        .then((res) => {
          if (res.data.data.length !== max) {
            setDataReceived(true);
          }

          res.data.data.map((item: any) => {
            console.log('Data item: ', item);
            if (catData.length > 0) {
              console.log('inside the data: ', item);
              const found = catData.findIndex(
                (category: any) =>
                  category.AssetCategoryKey === item.AssetCategoryKey
              );
              console.log('found: ', found);
              if (found === -1) {
                catData.push({
                  AssetCategoryKey: item.AssetCategoryKey,
                  name: item.AssetCategoryID,
                  productCount: 1,
                  pv: 2400,
                  amt: 2400,
                });
              } else {
                catData[found].productCount++;
              }
            } else {
              catData.push({
                AssetCategoryKey: item.AssetCategoryKey,
                name: item.AssetCategoryID,
                productCount: 1,
                pv: 2400,
                amt: 2400,
              });
            }
          });

          setLast(res.data.data[res.data.data.length - 1].__rowid__);
          setData(data.concat(res.data.data));
          setCategoryData(catData);
        })
        .catch((res) => {
          console.log('res catch: ', res);
        });
    }
    console.log('categoryData: ', catData);
  }, [data]);

  const getOperationalStatus = (OperationalStatus: any) => {
    var total = 0;
    data.map((res: any) => {
      if (res.OperationalStatus === OperationalStatus) {
        total = total + 1;
      }
    });

    return total;
  };

  return (
    <div className={classes.root}>
      <Container maxWidth='sm'>
        {dataReceived ? (
          <div>
            <Typography
              variant='h4'
              component='h1'
              gutterBottom
              className={classes.heading}
            >
              Equipment Dashboard
            </Typography>

            <div className={classes.OperationalStatusSection}>
              <div className={classes.OperationalStatus}>
                <Typography variant='h5' component='h2'>
                  Operational
                </Typography>
                <Typography variant='h4'>
                  {getOperationalStatus('Operational')}
                </Typography>
              </div>
              <div className={classes.OperationalStatus}>
                <Typography variant='h5' component='h2'>
                  Non-Operational
                </Typography>
                <Typography variant='h4'>
                  {getOperationalStatus('Non-Operational')}
                </Typography>
              </div>
            </div>
            {console.log('categoryData: ', categoryData)}
            <div className={classes.chart}>
              <Chart data={categoryData} />
            </div>
          </div>
        ) : (
          <div className={classes.heading}>
            <CircularProgress />
          </div>
        )}
      </Container>
    </div>
  );
}
