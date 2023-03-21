import styled from 'styled-components';
import React, { useMemo } from 'react';
import CountUp from 'react-countup';
import useTotalValueLocked from '../../../hooks/useTotalValueLocked';
import BoardroomIcon from '../../../assets/img/bshares.png';
import useBombFinance from '../../../hooks/useBombFinance';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import useWithdrawCheck from '../../../hooks/boardroom/useWithdrawCheck';
import useModal from '../../../hooks/useModal';
import Value from '../../../components/Value';
import DepositModal from '../../Boardroom/components/DepositModal';
import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import WithdrawModal from '../../Boardroom/components/WithdrawModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useStakeToBoardroom from '../../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';

import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';
import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import CardIcon from '../../../components/CardIcon';
import useClaimRewardTimerBoardroom from '../../../hooks/boardroom/useClaimRewardTimerBoardroom';
import useClaimRewardCheck from '../../../hooks/boardroom/useClaimRewardCheck';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import useBombStats from '../../../hooks/useBombStats';
import { getDisplayBalance } from '../../../utils/formatBalance';

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

const BoardroomCard = () => {
  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const TVL = useTotalValueLocked();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const bombFinance = useBombFinance();
  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );
  const canWithdrawFromBoardroom = useWithdrawCheck();

  const bombStats = useBombStats();
  const { onReward } = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();

  const tokenPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const { from, to } = useClaimRewardTimerBoardroom();
  return (
    <CardContainer>
      <CardHeader>
        <img src={BoardroomIcon} style={{ width: '40px', height: '40px' }} />
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
              <CountUp end={Number(TVL)} separator="," prefix="$" />
            </span>{' '}
          </CardTvl>
        </div>
      </CardRow>
      <CardRow style={{ textAlign: 'right', alignContent: 'right' }}>
        <div style={{ textAlign: 'right', alignContent: 'right' }}>Total Staked:</div>
      </CardRow>
      <CardRow>
        <div>
          <CardLabel>Daily Returns 1</CardLabel>
          <CardValue>Value 1</CardValue>
        </div>
        <div>
          <CardLabel>Your Stake</CardLabel>
          <CardValue>Value 2</CardValue>
        </div>
        <div>
          <CardLabel>Earned</CardLabel>
          <CardValue>Value 3</CardValue>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <IconButton disabled={!canWithdrawFromBoardroom} onClick={onPresentWithdraw}>
              <RemoveIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
            </IconButton>
            <IconButton onClick={onPresentDeposit}>
              <AddIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
            </IconButton>
          </div>
          <Button
            onClick={onReward}
            className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
            disabled={earnings.eq(0) || !canClaimReward}
          >
            Claim Reward
          </Button>
        </div>
      </CardRow>
    </CardContainer>
  );
};

export default BoardroomCard;
