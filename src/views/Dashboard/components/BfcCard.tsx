import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import CountUp from 'react-countup';
import Home from '../../Home/Home';
import useTotalValueLocked from '../../../hooks/useTotalValueLocked';
import { roundAndFormatNumber } from '../../../0x';
import useBombStats from '../../../hooks/useBombStats';
import useBondStats from '../../../hooks/useBondStats';
import usebShareStats from '../../../hooks/usebShareStats';
import usebShareStats2 from '../../../hooks/usebShareStats2';
import TokenSymbol from '../../../components/TokenSymbol';
import useCurrentEpoch from '../../../hooks/useCurrentEpoch';
import moment from 'moment';
import ProgressCountdown from '../../Boardroom/components/ProgressCountdown';
import useTreasuryAllocationTimes from '../../../hooks/useTreasuryAllocationTimes';
import useCashPriceInEstimatedTWAP from '../../../hooks/useCashPriceInEstimatedTWAP';

import { Alert } from '@material-ui/lab';
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toString();
}

const BfcCard = () => {
  const cashStat = useCashPriceInEstimatedTWAP();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const currentEpoch = useCurrentEpoch();

  const [scalingFactorOld, setScalingFactorOld] = useState<number | null>(null);
  const [scalingFactorOldDisplay, setScalingFactorOldDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (scalingFactorOld !== Number(scalingFactor)) {
      setScalingFactorOldDisplay(scalingFactorOld);
      setScalingFactorOld(Number(scalingFactor));
    }
  }, [scalingFactor]);

  const TVL = useTotalValueLocked();
  //   const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  //   const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const bShareStats2 = usebShareStats2();
  const tBondStats = useBondStats();
  //   const bombFinance = useBombFinance();

  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );

  const bSharePriceInDollarsBTC = useMemo(
    () => (bShareStats2 ? Number(bShareStats2.priceInDollars).toFixed(2) : null),
    [bShareStats2],
  );

  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );

  const bSharePriceInBTC = useMemo(
    () => (bShareStats2 ? Number(bShareStats2.tokenInFtm).toFixed(8) : null),
    [bShareStats2],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const { to } = useTreasuryAllocationTimes();

  return (
    <Card>
      <>
        <Title>Bomb Finance Summary</Title>
        <div
          style={{
            width: '1100px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            flexGrow: 1,
          }}
        >
          <Table style={{ marginLeft: '25px' }}>
            <>
              <TableRow style={{ borderBottom: '0' }}>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell style={{ fontSize: '11px', fontWeight: 400 }}>Current Supply</TableCell>
                <TableCell style={{ fontSize: '11px' }}>Total Supply</TableCell>
                <TableCell style={{ fontSize: '11px' }}>Price</TableCell>
                <TableCell style={{ width: '0' }}></TableCell>
              </TableRow>
              <TableRow style={{ borderBottom: '0' }}>
                <TableCell3 />
                <TableCell3 />
                <TableCell2 />
                <TableCell2 />
                <TableCell2 />
                <TableCell2 />
              </TableRow>
              <TableRow>
                <TableCell>
                  <TokenSymbol symbol="BOMB" size={27} />
                </TableCell>
                <TableCell>$BOMB</TableCell>
                <TableCell>{formatNumber(parseInt(bombCirculatingSupply))}</TableCell>
                <TableCell>{formatNumber(parseInt(bombTotalSupply))}</TableCell>
                <TableCell>
                  <span style={{ fontSize: '14px', alignContent: 'flex-start' }}>
                    ${bombPriceInDollars ? roundAndFormatNumber(Number(bombPriceInDollars), 2) : '-.--'}
                  </span>
                  <br />

                  <span style={{ fontSize: '14px', color: 'white' }}>
                    {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTCB
                  </span>
                </TableCell>
                <TableCell>
                  <TokenSymbol symbol="FOX" size={27} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TokenSymbol symbol="BSHARE" size={27} />
                </TableCell>
                <TableCell>$BSHARE</TableCell>
                <TableCell>{formatNumber(parseInt(bShareCirculatingSupply))}</TableCell>
                <TableCell>{formatNumber(parseInt(bShareTotalSupply))}</TableCell>
                <TableCell>
                  <span style={{ fontSize: '14px' }}>${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}</span>
                  <br />
                  <span style={{ fontSize: '14px', color: 'white', display: 'inline' }}>
                    {bSharePriceInBTC ? Number(bSharePriceInBTC) / 10000 : '-.----'} BTCB
                  </span>
                </TableCell>
                <TableCell>
                  <TokenSymbol symbol="FOX" size={27} />
                </TableCell>
              </TableRow>
              <TableRow style={{ borderBottom: '0' }}>
                <TableCell>
                  <TokenSymbol symbol="BBOND" size={27} />
                </TableCell>
                <TableCell>$BBOND</TableCell>
                <TableCell>{formatNumber(parseInt(tBondCirculatingSupply))}</TableCell>
                <TableCell>{formatNumber(parseInt(tBondTotalSupply))}</TableCell>
                <TableCell>
                  <span style={{ fontSize: '14px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
                  <br />
                  <span style={{ fontSize: '14px', color: 'white' }}>
                    {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTCB
                  </span>
                </TableCell>
                <TableCell>
                  <TokenSymbol symbol="FOX" size={27} />
                </TableCell>
              </TableRow>
              <TableRow style={{ borderBottom: '0' }}>
                <TableCell3 />
                <TableCell3 />
                <TableCell2 />
                <TableCell2 />
                <TableCell2 />
                <TableCell2 />
              </TableRow>
            </>
          </Table>
          <div style={{ marginLeft: 'auto' }}>
            <EpochWrapper>
              <EpochLabel>Current Epoch</EpochLabel>
              <EpochValue>{Number(currentEpoch)}</EpochValue>
              <Line style={{ width: '185px' }} />
            </EpochWrapper>
            <TimeWrapper>
              <TimeValue>
                <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
              </TimeValue>
              <TimeLabel>Next Epoch in</TimeLabel>
            </TimeWrapper>
            <Line style={{ width: '128px' }} />
            <NumberWrapper>
              <InnerNumberWrapper>
                <NumberValue>Live TWAP: </NumberValue>
                <NumberLabel>{scalingFactor}</NumberLabel>
              </InnerNumberWrapper>

              <InnerNumberWrapper>
                <NumberValue>TVL: </NumberValue>
                <NumberLabel>
                  <span style={{ fontSize: '14px' }}>
                    <CountUp end={Number(TVL)} separator="," prefix="$" />
                  </span>
                </NumberLabel>
              </InnerNumberWrapper>

              <InnerNumberWrapper>
                <NumberValue>Last EPOCH TWAP: </NumberValue>
                <NumberLabel>{scalingFactor}</NumberLabel>
              </InnerNumberWrapper>
            </NumberWrapper>
          </div>
        </div>
      </>
    </Card>
  );
};
const NumberWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0px;
  flex-direction: column;
`;
const InnerNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  flex-direction: row;
`;

const NumberLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #00e8a2;
`;

const NumberValue = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: white;
`;

const Card = styled.div`
  background: rgba(35, 40, 75, 0.75);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: centre;
  width: 1090px;
  height: 289px;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 24px;
  padding-top: 8px;
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 22px;
`;

const Title = styled.div`
  text-align: center;
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 22px !important;
  line-height: 30px !important;
  color: #ffffff !important;
  border-bottom: 0.5px solid rgba(195, 197, 203, 0.75);
  width: 970px;
  margin-top: 2.41px;
`;

const Table = styled.table`
  table-layout: auto;
  margin-top: 25px;
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;
`;

const TableRow = styled.tr`
  border-bottom: 0.5px solid rgba(195, 197, 203, 0.75);
`;

const TableCell = styled.td`
  padding: 10px;
`;
const TableCell2 = styled.td`
  padding: 0px;
  border-bottom: 0.5px solid rgba(195, 197, 203, 0.75);
`;
const TableCell3 = styled.td`
  padding: 0px;
`;

const EpochWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  flex-direction: column;
`;
const finalTextWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  flex-direction: column;
`;

const EpochLabel = styled.div`
  font-size: 18px;
  font-weight: 300;
  margin-right: 8px;
`;

const EpochValue = styled.div`
  font-size: 34px;
  font-weight: 700;
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  flex-direction: column;
`;

const TimeLabel = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-right: 8px;
`;

const TimeValue = styled.div`
  font-size: 34px;
  font-weight: 700;
`;
const Line = styled.hr`
  width: 100%;
  border-bottom: 0.5px solid rgba(195, 197, 203, 0.75);
  margin-top: 4px;
  align: center;
`;

export default BfcCard;
