import React from 'react';

import DepositIcon from '../../../assets/img/downArr.png';
import PurchaseIcon from '../../../assets/img/purchaseIcon.png';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import { Box, Button } from '@material-ui/core';
import { useWallet } from 'use-wallet';
import ExchangeModal from '../../Bond/components/ExchangeModal';
import ERC20 from '../../../bomb-finance/ERC20';
import AccountButton from '../../../../src/components/Nav/AccountButton';

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
  type?: string;
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
  type,
}) => {
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
          {
            // approveStatus !== ApprovalState.APPROVED && !disabled ? (
            //   <Button
            //     className="shinyButton"
            //     disabled={approveStatus === ApprovalState.PENDING || approveStatus === ApprovalState.UNKNOWN}
            //     onClick={() => catchError(approve(), `Unable to approve ${fromTokenName}`)}
            //   >
            //     {`Approve ${fromTokenName}`}
            //   </Button>
            // ) :
            <Button
              // className={disabled ? 'shinyButtonDisabled' : 'shinyButton'}
              onClick={onPresent}
              disabled={disabled}
              style={{
                width: '107px',
                height: '28px',
                border: disabled ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 1)',
                borderRadius: '50px',
                textTransform: 'unset',
                color: disabled ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 1)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {action}
              <img
                src={type === 'redeem' ? DepositIcon : PurchaseIcon}
                style={{ width: '24px', height: '24px' }}
                alt="Something"
              />
            </Button>
          }
        </>
      ) : (
        <Box style={{ width: '107px', height: '28px', fontSize: '15px !important' }}>
          <div style={{ fontSize: '8px' }}>
            <AccountButton size={10} />
          </div>
          {/* <Button color="primary" variant="contained" onClick={() => connect('injected')}>Unlock Wallet</Button> */}
        </Box>
      )}
    </div>
  );
};

export default BondCardButton;
