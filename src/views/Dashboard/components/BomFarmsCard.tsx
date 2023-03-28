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
import Bombbtcb from '../../../assets/img/bomb-bitcoin-LP.png';
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

import useBank from '../../../hooks/useBank';
import useStatsForPool from '../../../hooks/useStatsForPool';
import useRedeem from '../../../hooks/useRedeem';
import { useWallet } from 'use-wallet';
import useEarnings from '../../../hooks/useEarnings';
import BomFarmsCard2 from './BombFarmsCard2';
import useHarvest from '../../../hooks/useHarvest';
import Bsharebtcb from '../../../assets/img/bshare-bnb-LP.png';

interface StakeProps {
  bank: Bank;
}

const BomFarmsCard = () => {
  const bank1 = useBank('');
  const bank2 = useBank('');

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>Bomb Farms</CardTitle>
      </CardHeader>
      <div>
        <CardSubTitle>Stake your LP tokens in our farms to start earning $BSHARE</CardSubTitle>
      </div>

      <BomFarmsCard2 bankName="BombBtcbLPBShareRewardPool" myString="BOMB-BTCB" iconLoc={Bombbtcb} />
      <BomFarmsCard2 bankName="BshareBnbLPBShareRewardPool" myString="BSHARE-BTCB" iconLoc={Bsharebtcb} />
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
  width: 1090px;
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
export default BomFarmsCard;
