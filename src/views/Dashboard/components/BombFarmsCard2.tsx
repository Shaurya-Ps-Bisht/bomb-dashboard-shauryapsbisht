import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';

// import Button from '../../../components/Button';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import CountUp from 'react-countup';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import IconButton from '../../../components/IconButton';
import Bombbtctb from '../../../assets/img/bomb-bitcoin-LP.png';
import Bsharebtcb from '../../../assets/img/bshare-bnb-LP.png';
//import Label from '../../../components/Label';
import Value from '../../../components/Value';
import { ThemeContext } from 'styled-components';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useZap from '../../../hooks/useZap';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';

import { getDisplayBalance } from '../../../utils/formatBalance';

import DepositModal from '../../Bank/components/DepositModal';
import WithdrawModal from '../../Bank/components/WithdrawModal';
// import ZapModal from './ZapModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../bomb-finance';
import useHarvest from '../../../hooks/useHarvest';

import useBank from '../../../hooks/useBank';
import useStatsForPool from '../../../hooks/useStatsForPool';
import useRedeem from '../../../hooks/useRedeem';
import { useWallet } from 'use-wallet';
import useEarnings from '../../../hooks/useEarnings';

interface StakeProps {
  bank: Bank;
}

const BomFarmsCard2 = () => {
  const bank1 = useBank('BombBtcbLPBShareRewardPool');
  const bank2 = useBank('BshareBnbLPBShareRewardPool');
  const tokenBalance2 = useTokenBalance(bank2.depositToken);
  const stakedBalance2 = useStakedBalance(bank2.contract, bank2.poolId);

  //   const { onStake } = useStake(bank1);
  //   const onStake1 = onStake;
  //   const { onWithdraw } = useWithdraw(bank1);
  //   const onWithdraw1 = onWithdraw;

  const { onStake } = useStake(bank2);
  const { onWithdraw } = useWithdraw(bank2);

  const { account } = useWallet();
  let statsOnPool = useStatsForPool(bank1);

  const { onRedeem } = useRedeem(bank2);
  const earnings = useEarnings(bank2.contract, bank2.earnTokenName, bank2.poolId);
  const { onReward } = useHarvest(bank2);

  let statsOnPool2 = useStatsForPool(bank2);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance2}
      decimals={bank2.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank2.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance2}
      decimals={bank2.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank2.depositTokenName}
    />,
  );

  return (
    <CardContainer>
      <CardHeader>
        <img src={Bsharebtcb} style={{ width: '40px', height: '40px' }} />
        <CardTitle>Boardroom</CardTitle>
      </CardHeader>

      <CardRow style={{ borderBottom: '0.5px solid rgba(195, 197, 203, 0.75)' }}>
        <div>
          <CardSubTitle>Stake BSHARE and earn BOMB every epoch</CardSubTitle>
        </div>
        <div>
          <CardTvl>
            TVL:
            <span style={{ fontSize: '20px' }}>
              <CardValue>{statsOnPool2?.TVL}</CardValue>
            </span>{' '}
          </CardTvl>
        </div>
      </CardRow>
      <CardRow style={{ textAlign: 'right', alignContent: 'right' }}>
        <div style={{ textAlign: 'right', alignContent: 'right' }}>Total Staked:</div>
      </CardRow>
      <CardRow>
        <div>
          <CardLabel>Daily Returns </CardLabel>
          <CardValue>{statsOnPool2?.dailyAPR}</CardValue>
        </div>
        <div>
          <CardLabel>Your Stake</CardLabel>
          <CardValue style={{ fontSize: 14 }}>
            <Value value={getDisplayBalance(stakedBalance2, bank1.depositToken.decimal)} />
          </CardValue>
        </div>
        <div>
          <CardLabel>Earned</CardLabel>
          <CardValue>
            <Value value={getDisplayBalance(earnings)} />
          </CardValue>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <IconButton onClick={onPresentWithdraw}>
              <RemoveIcon />
            </IconButton>
            <IconButton
              disabled={bank2.closedForStaking}
              onClick={() => (bank2.closedForStaking ? null : onPresentDeposit())}
            >
              <AddIcon />
            </IconButton>
          </div>
          <Button
            onClick={onReward}
            disabled={earnings.eq(0)}
            className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
          >
            Claim
          </Button>
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
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

const CardTitle = styled.div`
  font-family: 'Nunito' !important;
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 22px !important;
  line-height: 30px !important;
  color: #ffffff !important;
`;

const CardSubTitle = styled.div`
  font-size: 1rem;
  font-weight: normal;
  margin-left: 0.5rem;
`;

const CardTvl = styled.div`
  font-size: 1rem;
  font-weight: normal;
  margin-left: auto;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const CardLabel = styled.div`
  font-size: 0.75rem;
  font-weight: normal;
  color: #a0aec0;
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
export default BomFarmsCard2;
