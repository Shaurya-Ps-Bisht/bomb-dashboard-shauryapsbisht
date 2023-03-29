import React, { useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import { Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import useBondStats from '../../hooks/useBondStats';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { ReactComponent as SomeIcon } from '../../assets/img/why.svg';
import discordIcon from '../../assets/img/discordDISCORD.svg';
import BomFarmsCard from './components/BomFarmsCard';

import BfcCard from './components/BfcCard';
import BrCard from './components/BrCard';
import BondCard from './components/BondCard';

// import HomeImage from '../../assets/img/dashboard_1.jpg';

import Background_dash from './components/Dashboard_background';
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
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', maxWidth: '1138px' }}>
          <FirstDiv>
            <ThreeRowBox>
              <BoxLinkStrat href="#">Read Investment Strategy {'>'}</BoxLinkStrat>
              <BoxLinkInvest href="#">Invest Now</BoxLinkInvest>
              <Row style={{ justifyContent: 'space-between' }}>
                <BoxLink
                  style={{
                    display: 'flex',
                    width: '335px',
                    height: '40px',
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
                    display: 'flex',
                    width: '335px',
                    height: '40px',
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
            <Card style={{ height: '351px', width: '418px' }}>
              <Title
                style={{
                  textAlign: 'left',
                  marginLeft: '19px',
                  marginTop: '8px',
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
        <div>
          <BondCard />
        </div>
      </Page>
    </Switch>
  );
};
const BoxLinkInvest = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 694px;
  height: 40px;
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
  margin-bottom: 7.5px;
`;
const BoxLinkStrat = styled.a`
  display: flex;
  width: 210px;
  height: 20px;
  background-color: transparent;
  font-size: 16px;
  font-weight: 600;
  color: #9ee6ff;
  margin-bottom: 15.5px;
  margin-left: auto; ;
`;
const BoxLink = styled.a`
  display: inline-block;
  font-weight: 700;
  align-items: center;
  font-size: 18px;
  color: #000000;
  text-align: center;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #728cdf;
`;

const Wrapper = styled.div`
  display: flex;
`;

const FirstDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const SecondDiv = styled.div``;

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
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.div`
  text-align: center;
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 22px !important;
  line-height: 30px !important;
  color: #ffffff !important;
`;

export default Dashboard;
