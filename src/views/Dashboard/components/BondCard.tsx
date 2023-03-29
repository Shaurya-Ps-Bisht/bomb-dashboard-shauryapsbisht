import styled from 'styled-components';
import React, { useMemo, useCallback } from 'react';
import BBondIcon from '../../../assets/img/bbond.png';
import useBombFinance from '../../../hooks/useBombFinance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useBondsPurchasable from '../../../hooks/useBondsPurchasable';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../../bomb-finance/constants';
import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import useBondStats from '../../../hooks/useBondStats';
import BondCardButton from './BondCardButton';
import { useTransactionAdder } from '../../../state/transactions/hooks';

const BondCard = () => {
  const bombFinance = useBombFinance();
  const cashPrice = useCashPriceInLastTWAP();
  const bondStat = useBondStats();
  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const bondsPurchasable = useBondsPurchasable();
  const addTransaction = useTransactionAdder();
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );
  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  return (
    <CardContainer>
      <CardHeader>
        <img src={BBondIcon} style={{ width: '55px', height: '55px' }} />
        <div style={{ flexGrow: 1 }}>
          <CardTitle>Bonds</CardTitle>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <CardSubTitle>
              BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
            </CardSubTitle>
          </div>
        </div>
      </CardHeader>

      <CardRow>
        <div>
          <CardLabel>Current Price: {'(Bomb)'}^2</CardLabel>
          <CardValue style={{ fontSize: '22px', fontWeight: '600', marginTop: '20px' }}>
            10,000 BBond = {Number(bondStat?.tokenInFtm).toFixed(4)} BTCB
          </CardValue>
        </div>
        <div>
          <CardLabel>Available to redeem: </CardLabel>
          <CardValue style={{ fontSize: '39px' }}>
            <img src={BBondIcon} style={{ width: '39px', height: '39px' }} />
            {getDisplayBalance(bondBalance)}
          </CardValue>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '417px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottom: '0.5px solid rgba(195, 197, 203, 0.75)',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>Purchase BBond</span>
              <span style={{ marginBottom: '8px', fontWeight: '300px' }}>
                {!isBondPurchasable
                  ? 'BOMB is over peg'
                  : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'}
              </span>
            </div>
            <BondCardButton
              action="Purchase"
              fromToken={bombFinance.BOMB}
              fromTokenName="BOMB"
              toToken={bombFinance.BBOND}
              toTokenName="BBOND"
              priceDesc={
                !isBondPurchasable
                  ? 'BOMB is over peg'
                  : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
              }
              onExchange={handleBuyBonds}
              disabled={!bondStat || isBondRedeemable}
              type="purchase"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>Redeem Bomb</span>
              <span style={{ marginBottom: '8px', fontWeight: '300px' }}>
                {!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null}
              </span>
            </div>
            <div>
              <BondCardButton
                action="Redeem"
                fromToken={bombFinance.BBOND}
                fromTokenName="BBOND"
                toToken={bombFinance.BOMB}
                toTokenName="BOMB"
                priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
                onExchange={handleRedeemBonds}
                disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                disabledDescription={!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null}
                type="redeem"
              />
            </div>
          </div>
        </div>
      </CardRow>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: rgba(35, 40, 75, 0.75);
  border: 1px solid #728cdf;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 24px;
  padding-top: 14px;
  padding-bottom: 0px;
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  width: 1090px;
  height: 202px;
  margin-top: 20.5px;
  margin-bottom: 27.5px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CardTitle = styled.div`
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 22px !important;
  line-height: 30px !important;
  color: #ffffff !important;
`;

const CardSubTitle = styled.div`
  font-size: 1rem;
  font-weight: normal;
`;

const CardTvl = styled.div`
  font-size: 1rem;
  font-weight: normal;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const CardLabel = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: #ffffff;
`;

const RecommendedBox = styled.div`
  background-color: green;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
`;

const CardValue = styled.div`
  font-size: 1rem;
  font-weight: normal;
`;

const CardButton = styled.button`
  font-size: 0.875rem;
  font-weight: bold;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-left: 0.5rem;
  cursor: pointer;

  &.primary {
    background-color: #2d3748;
    color: #fff;
  }

  &.secondary {
    background-color: #e2e8f0;
    color: #4a5568;
  }
`;

export default BondCard;
