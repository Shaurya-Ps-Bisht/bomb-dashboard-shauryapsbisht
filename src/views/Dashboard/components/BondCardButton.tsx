import styled from 'styled-components';
import React, { useMemo } from 'react';
import CountUp from 'react-countup';
import useTotalValueLocked from '../../../hooks/useTotalValueLocked';
import BBondIcon from '../../../assets/img/bbond.png';
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
import useBondsPurchasable from '../../../hooks/useBondsPurchasable';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../../bomb-finance/constants';
import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import useBondStats from '../../../hooks/useBondStats';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import UnlockWallet from '../../../components/UnlockWallet';
import { useWallet } from 'use-wallet';
import ExchangeModal from '../../Bond/components/ExchangeModal';
import ERC20 from '../../../bomb-finance/ERC20';
import useCatchError from '../../../hooks/useCatchError';

interface BondCardButtonProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;
  priceDesc: string;
  onExchange: (amount: string) => void;
  disabled?: boolean;
  disabledDescription?: string;
}

const BondCardButton: React.FC<BondCardButtonProps> = ({
  action,
  fromToken,
  fromTokenName,
  toToken,
  toTokenName,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
}) => {
  const bombFinance = useBombFinance();
  const bondStat = useBondStats();
  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const bondsPurchasable = useBondsPurchasable();
  const cashPrice = useCashPriceInLastTWAP();
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const catchError = useCatchError();
  const {
    contracts: { Treasury },
  } = useBombFinance();
  const [approveStatus, approve] = useApprove(bombFinance.BBOND, Treasury.address);
  const { account } = useWallet();
  const balance = useTokenBalance(fromToken);

  const [onPresent, onDismiss] = useModal(
    <ExchangeModal
      title={action}
      description={priceDesc}
      max={balance}
      onConfirm={(value) => {
        onExchange(value);
        onDismiss();
      }}
      action={action}
      tokenName={fromTokenName}
    />,
  );

  return (
    <div>
      {!!account ? (
        <>
          {approveStatus !== ApprovalState.APPROVED && !disabled ? (
            <Button
              className="shinyButton"
              disabled={approveStatus === ApprovalState.PENDING || approveStatus === ApprovalState.UNKNOWN}
              onClick={() => catchError(approve(), `Unable to approve ${fromTokenName}`)}
            >
              {`Approve ${fromTokenName}`}
            </Button>
          ) : (
            <Button
              className={disabled ? 'shinyButtonDisabled' : 'shinyButton'}
              onClick={onPresent}
              disabled={disabled}
            >
              {disabledDescription || action}
            </Button>
          )}
        </>
      ) : (
        <UnlockWallet />
      )}
    </div>
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

export default BondCardButton;
