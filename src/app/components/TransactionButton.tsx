import React, { ReactNode } from "react";
import { PreparedTransaction } from "thirdweb";
import { TransactionButton as ThirdwebTransactionButton } from "thirdweb/react";
import toast from "react-hot-toast"
import { cn } from "../lib/utils";

type TransactionButtonProps = {
    id?: string;
    disabled?: boolean,
    transaction: () => PreparedTransaction<any> | Promise<PreparedTransaction<any>>,
    onSent: string,
    onConfirmed: string,
    onError: string,
    successCallback?: () => void,
    children: ReactNode,
    className?: string
}

export default function TransactionButton(props: TransactionButtonProps) {
    return (
        <ThirdwebTransactionButton
            className={cn(
                "!w-full inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                props.className
            )}
            disabled={props.disabled}
            transaction={props.transaction}
            onTransactionSent={(result) =>
                toast.loading(props.onSent, {
                    duration: Infinity,
                    id: props.id ?? "tx"
                })
            }
            onTransactionConfirmed={(receipt) => {
                toast.success(props.onConfirmed, {
                    duration: 5000,
                    id: props.id ?? "tx"
                })
                props.successCallback && props.successCallback();
            }}
            onError={(error) =>
                toast.error(props.onError, {
                    duration: 5000,
                    id: props.id ?? "tx"
                })
            }
        >
            {props.children}
        </ThirdwebTransactionButton>
    )
}