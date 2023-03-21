import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
//import useBombStats from '../../hooks/useBombStats';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { ReactComponent as SomeIcon } from '../../assets/img/why.svg';
import discordIcon from '../../assets/img/discordDISCORD.svg';
import BomFarmsCard from './components/BomFarmsCard';

import { Alert } from '@material-ui/lab';
import BfcCard from './components/BfcCard';
import BrCard from './components/BrCard';

// import HomeImage from '../../assets/img/dashboard_1.jpg';

import Background_dash from './components/Dashboard_background';
import { Grid, Box } from '@material-ui/core';
import { Helmet } from 'react-helmet';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background: url(${HomeImage}) repeat !important;
//     background-size: cover !important;
//     background-color: #171923;
//   }
// `;
const TITLE = 'bomb.money | Dashboard';

const Dashboard: React.FC = () => {
  const { path } = useRouteMatch();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const isBondPayingPremium = useMemo(() => Number(bondStat?.tokenInFtm) >= 1.1, [bondStat]);
  // console.log("bondstat", Number(bondStat?.tokenInFtm))
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

  return (
    <Switch>
      <Page>
        {/* <BackgroundImage /> */}
        <Background_dash />
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <BfcCard />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <FirstDiv>
            <ThreeRowBox>
              <BoxLinkInvest href="#">Invest Now</BoxLinkInvest>
              <Row style={{ justifyContent: 'space-between' }}>
                <BoxLink
                  style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}
                  href="https://discord.bomb.money"
                  target="_blank"
                >
                  <img src={discordIcon} />
                  Chat on Discord
                </BoxLink>
                <BoxLink
                  style={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}
                  href="https://docs.bomb.money"
                  target="_blank"
                >
                  <SomeIcon />
                  Read Docs
                </BoxLink>
              </Row>
              <BrCard />
            </ThreeRowBox>
          </FirstDiv>
          <SecondDiv>
            <Card style={{ fontFamily: 'Nunito !important', height: 325 }}>
              <Title
                style={{
                  textAlign: 'left',
                }}
              >
                Latest News
              </Title>
            </Card>
          </SecondDiv>
        </div>
        <div>
          <BomFarmsCard />
        </div>
      </Page>
    </Switch>
  );
};
const BoxLinkInvest = styled.a`
  display: inline-block;
  text-align: center;
  padding: 10px 20px;
  background: radial-gradient(
    59345.13% 4094144349.28% at 39511.5% -2722397851.45%,
    rgba(0, 245, 171, 0.5) 0%,
    rgba(0, 173, 232, 0.5) 100%
  );
  border: 0.5px solid #e41a1a;
  color: #ffffff;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
`;
const BoxLink = styled.a`
  display: inline-block;
  font-weight: 700;
  font-size: 18px;
  color: #000000;
  text-align: center;
  text-decoration: none;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #728cdf;
`;

const Wrapper = styled.div`
  display: flex;
`;

const FirstDiv = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
`;

const SecondDiv = styled.div`
  width: 40%;
`;

const Icon = styled.img`
  width: 24px;
  margin-right: 10px;
`;

const Text = styled.span`
  font-size: 16px;
`;

const ThreeRowBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
`;

const CustomComponentWrapper = styled.div`
  margin-top: 20px;
`;
const Card = styled.div`
  background: rgba(35, 40, 75, 0.75);
  border: 1px solid #728cdf;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 24px;
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.div`
  text-align: center;
  font-family: 'Nunito' !important;
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 22px !important;
  line-height: 30px !important;
  color: #ffffff !important;
`;

export default Dashboard;
