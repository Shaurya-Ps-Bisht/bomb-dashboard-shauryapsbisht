import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';
import { getDisplayBalance } from '../../../utils/formatBalance';
import DepositModal from '../../Bank/components/DepositModal';
import WithdrawModal from '../../Bank/components/WithdrawModal';
import useHarvest from '../../../hooks/useHarvest';
import useBank from '../../../hooks/useBank';
import useStatsForPool from '../../../hooks/useStatsForPool';
import useEarnings from '../../../hooks/useEarnings';
import DepositIcon from '../../../assets/img/upArr.png';
import WithdrawIcon from '../../../assets/img/downArr.png';
import BoardroomIcon from '../../../assets/img/bshares.png';
import useBombStats from '../../../hooks/useBombStats';
import useShareStats from '../../../hooks/usebShareStats';

const BomFarmsCard2 = ({ bankName, myString, iconLoc }: { bankName: string; myString: string; iconLoc: string }) => {
  const bank = useBank(bankName);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);

  //   const { onStake } = useStake(bank1);
  //   const onStake1 = onStake;
  //   const { onWithdraw } = useWithdraw(bank1);
  //   const onWithdraw1 = onWithdraw;

  const { onStake } = useStake(bank);
  const { onWithdraw } = useWithdraw(bank);
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const bombStats = useBombStats();
  const tShareStats = useShareStats();
  const tokenStats = bank.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );

  const stakedEarnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  let statsOnPool = useStatsForPool(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <CardContainer>
      <CardHeader>
        <img src={iconLoc} style={{ width: '40px', height: '40px' }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            borderBottom: '0.5px solid rgba(195, 197, 203, 0.75)',
          }}
        >
          <CardTitle>
            {myString}
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
          <CardTvl>
            TVL:
            <span style={{ fontSize: '20px' }}>
              {' $'}
              {statsOnPool?.TVL}
            </span>{' '}
          </CardTvl>
        </div>
      </CardHeader>
      <CardRow>
        <div>
          <CardLabel>Daily Returns </CardLabel>
          <CardValue>{statsOnPool?.dailyAPR}</CardValue>
        </div>
        <div>
          <CardLabel>Your Stake</CardLabel>
          <CardValue>
            {/* <Value value= />
             */}
            <img src={iconLoc} style={{ width: '14px', height: '14px' }} />
            {getDisplayBalance(stakedBalance, bank.depositToken.decimal)}
          </CardValue>
          <CardValue>{`≈ $${earnedInDollars}`}</CardValue>{' '}
        </div>
        <div>
          <CardLabel>Earned</CardLabel>
          <CardValue>
            {/* <Value value= />
             */}
            <img src={BoardroomIcon} style={{ width: '14px', height: '14px' }} />
            {getDisplayBalance(earnings)}
          </CardValue>
          <CardValue>{`≈ $${stakedEarnedInDollars}`}</CardValue>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <button
            disabled={bank.closedForStaking}
            onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
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
              cursor: bank.closedForStaking ? 'default' : 'pointer',
              fontSize: '15px',
              marginLeft: '4px',
            }}
          >
            Deposit
            <img src={DepositIcon} style={{ width: '24px', height: '24px' }} />
          </button>
          <button
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
              fontSize: '15px',
              marginLeft: '4px',
            }}
          >
            Withdraw
            <img src={WithdrawIcon} style={{ width: '24px', height: '24px' }} />
          </button>
          <Button
            onClick={onReward}
            disabled={earnings.eq(0)}
            className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              textTransform: 'unset',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '148px',
              height: '28px',
              gap: '5px',
              border: '1px solid #FFFFFF',
              borderRadius: '50px',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              cursor: earnings.eq(0) ? 'default' : 'pointer',
              fontSize: '15px',
              marginLeft: '4px',
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
  background: transparent;
  // backdrop-filter: blur(5px);
  color: white;
  // box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  margin-top: 30px;
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
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
`;

const CardValue = styled.div`
  font-size: 1rem;
  font-weight: normal;
`;

export default BomFarmsCard2;
