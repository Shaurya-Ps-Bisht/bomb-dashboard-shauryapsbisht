import styled from 'styled-components';
import React, { useMemo } from 'react';
import CountUp from 'react-countup';
import useTotalValueLocked from '../../../hooks/useTotalValueLocked';
import BoardroomIcon from '../../../assets/img/bshares.png';
import DepositIcon from '../../../assets/img/upArr.png';
import WithdrawIcon from '../../../assets/img/downArr.png';
import useBombFinance from '../../../hooks/useBombFinance';
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
import useTotalStakedOnBoardroom from '../../../hooks/useTotalStakedOnBoardroom';

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
import useFetchBoardroomAPR from '../../../hooks/useFetchBoardroomAPR';

const BoardroomCard = () => {
  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const TVL = useTotalValueLocked();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const totalStaked = useTotalStakedOnBoardroom();
  const bombFinance = useBombFinance();
  const boardroomAPR = useFetchBoardroomAPR();
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
        <img src={BoardroomIcon} style={{ width: '55px', height: '55px' }} />
        <div style={{ borderBottom: '0.5px solid rgba(195, 197, 203, 0.75)', flexGrow: 1 }}>
          <CardTitle>
            Boardroom{' '}
            <div
              style={{
                backgroundColor: 'rgba(0, 232, 162, 0.5)',
                boxShadow: '0px 0px 8px rgba(0, 232, 162, 0.5)',
                display: 'inline-block',
                gap: '10px',
                position: 'relative',
                justifyContent: 'center',
                borderRadius: '3px',
                lineHeight: '16px',
                marginLeft: '7px',
                paddingInline: '5px',
              }}
            >
              <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '12px', margin: 0 }}>Recommended</span>
            </div>
          </CardTitle>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <CardSubTitle>Stake BSHARE and earn BOMB every epoch</CardSubTitle>
            <CardTvl>
              TVL:{' '}
              <span style={{ fontSize: '20px' }}>
                <CountUp end={Number(boardroomAPR.tvlBoardroom)} separator="," prefix="$" />
              </span>
            </CardTvl>
          </div>
        </div>
      </CardHeader>

      <CardRow style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
        <div style={{ alignContent: 'right' }}>
          Total Staked: <img src={BoardroomIcon} style={{ width: '25px', height: '25px' }} />
          <span style={{ fontSize: '20px' }}>
            <CountUp end={Number(getDisplayBalance(totalStaked))} separator="," decimals={0} />
          </span>
        </div>
      </CardRow>
      <CardRow>
        <div>
          <CardLabel>Daily Returns</CardLabel>
          <CardValue style={{ fontSize: '22px', fontWeight: '600' }}>
            {Number(boardroomAPR.realAPR).toFixed(2)}%
          </CardValue>
        </div>
        <div>
          <CardLabel>Your Stake</CardLabel>
          <CardValue>{getDisplayBalance(stakedBalance)}</CardValue>
        </div>
        <div>
          <CardLabel>Earned</CardLabel>
          <CardValue>{getDisplayBalance(earnings)}</CardValue>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button
              onClick={onPresentDeposit}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                width: '107px',
                height: '28px',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0px 4px 8px',
                gap: '5px',
                border: '1px solid #FFFFFF',
                borderRadius: '50px',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              Deposit
              <img src={DepositIcon} style={{ width: '24px', height: '24px' }} />
            </button>
            <button
              disabled={!canWithdrawFromBoardroom}
              onClick={onPresentWithdraw}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '107px',
                height: '28px',
                padding: '4px 0px 4px 8px',
                gap: '5px',
                border: '1px solid #FFFFFF',
                borderRadius: '50px',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                cursor: !canWithdrawFromBoardroom ? 'default' : 'pointer',
                fontSize: '15px',
                marginLeft: '4px',
              }}
            >
              Withdraw
              <img src={WithdrawIcon} style={{ width: '24px', height: '24px' }} />
            </button>
          </div>
          <Button
            onClick={onReward}
            className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
            disabled={earnings.eq(0) || !canClaimReward}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              textTransform: 'unset',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '217px',
              height: '28px',
              padding: '4px 0px 4px 8px',
              gap: '5px',
              border: '1px solid #FFFFFF',
              borderRadius: '50px',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              cursor: !canClaimReward ? 'default' : 'pointer',
              fontSize: '15px',
              marginLeft: '4px',
              marginTop: '10px',
            }}
          >
            Claim Rewards
            <img src={BoardroomIcon} style={{ width: '20px', height: '20px' }} />
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
  padding-top: 14px;
  padding-bottom: 0px;
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  width: 646px;
  height: 202px;
  margin-top: 7.5px;
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
  font-size: 14px;
  font-weight: 400;
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

export default BoardroomCard;
