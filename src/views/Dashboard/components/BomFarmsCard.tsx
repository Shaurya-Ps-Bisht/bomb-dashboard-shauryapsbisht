import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import Bombbtcb from '../../../assets/img/bomb-bitcoin-LP.png';
import { Bank } from '../../../bomb-finance';
import { Button } from '@material-ui/core';
import useEarnings from '../../../hooks/useEarnings';
import useBank from '../../../hooks/useBank';
import BomFarmsCard2 from './BombFarmsCard2';
import BoardroomIcon from '../../../assets/img/bshares.png';
import Bsharebtcb from '../../../assets/img/bshare-bnb-LP.png';
import useHarvest from '../../../hooks/useHarvest';
import { getDisplayBalance } from '../../../utils/formatBalance';

interface StakeProps {
  bank: Bank;
}

const CorrectHarvest = (bankName: string) => {
  const { onReward } = useHarvest(useBank(bankName));
  return onReward;
};

const CheckEarnings = (bankName: string) => {
  const bank = useBank(bankName);
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  if (Number(getDisplayBalance(earnings)) === 0) {
    return 0;
  }
};

const BomFarmsCard = () => {
  const disableCheck = CheckEarnings('BombBtcbLPBShareRewardPool') + CheckEarnings('BshareBnbLPBShareRewardPool');
  return (
    <CardContainer>
      <CardHeader
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <CardTitle>Bomb Farms</CardTitle>
        <Button
          onClick={() => {
            CorrectHarvest('BombBtcbLPBShareRewardPool');
            CorrectHarvest('BshareBnbLPBShareRewardPool');
          }}
          disabled={disableCheck === 0}
          className={disableCheck === 0 ? 'shinyButtonDisabled' : 'shinyButton'}
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
            fontSize: '15px',
            marginLeft: '4px',
          }}
        >
          Claim All
          <img src={BoardroomIcon} style={{ width: '20px', height: '20px' }} />
        </Button>
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
