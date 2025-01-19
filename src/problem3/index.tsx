// Assume React has been installed.
// @ts-ignore
import {FC, useMemo} from "react";


/*
--* PROBLEM 1 *--

This way of declaring the interface is not the recommended way.
To fix this we should create sub-interface that extends the main interface.

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

The solution should look like this:
*/

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}


/*
--* PROBLEM 2 *--

This interface has no property existed and also extends an undeclared and unused BoxProps interface.

The solution is to remove it:
*/


/*
--* PROBLEM 3 *--

This component is also declaring types for the Functional Component type and the props of the WalletPage component,
but in this code, props were not actually being used.

    const WalletPage: React.FC<Props> = (props: Props) => {
        const { children, ...rest } = props;
        ...
    }

The solution is to remove the 'Props' types and the props in the parentheses:
*/

const WalletPage: FC = () => {
    // Assume that these hooks are existed.
    // @ts-ignore
    const balances = useWalletBalances();
    // @ts-ignore
    const prices = usePrices();

    // Problem 4 Effect: Consolidate this validation logic for better conditional render.
    const blockchainPriorities: { [blockchain: string]: number } = {
        Osmosis: 100,
        Ethereum: 50,
        Arbitrum: 30,
        Zilliqa: 20,
        Neo: 20,
    };


    /*
    --* PROBLEM 4 *--

    In this code piece, the filter method uses lhsPriority > -99, but the variable lhsPriority is not defined. It should be balancePriority instead.
    Besides that, the overused of if-else conditions in both .filter and .sort functions makes the code super hard to read and understand in a short time.
    Not to mention that the numbers -1 and 1 are not used clearly, so we could not understand what are the purposes of them to return
    Final thing is the dependencies of sort, price are being unnecessarily stated here as it is unused in the useMemo() callback, thus it will affect the performance due to unnecessary re-rendering.

    const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
       const balancePriority = getPriority(balance.blockchain);
       if (lhsPriority > -99) {
           if (balance.amount <= 0) {
               return true;
           }
       }
       return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
       const leftPriority = getPriority(lhs.blockchain);
       const rightPriority = getPriority(rhs.blockchain);
           if (leftPriority > rightPriority) {
               return -1;
           } else if (rightPriority > leftPriority) {
               return 1;
           }
       });
    }, [balances, prices]);

    The solution for this would be:
   */

    const getPriority = (blockchain: string): number => {
        return blockchainPriorities[blockchain] ?? -99;
        // Problem 4 Effect: Consolidate this validation logic for better conditional render.
    };


    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: FormattedWalletBalance) => balance.amount > 0 || getPriority(balance.blockchain) > -99) // Problem 4 Effect: Simplified the conditions.
            .sort((lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) => getPriority(lhs.blockchain) - getPriority(rhs.blockchain)); // Problem 4 Effect: Return -1 and 1 in a more logical way and easy to understand.
    }, [balances]);


    const formattedBalances = useMemo(() => {
        return sortedBalances.map((balance: FormattedWalletBalance) => ({
            ...balance,
            formatted: balance.amount.toFixed(),
        }));
    }, [sortedBalances]);


    /*
    --* PROBLEM 5 *--

    In the mapping of the formattedBalances that renders out individual item of the list,
    the key that was used is index, which is not unique enough.

    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
       <WalletRow
            className={classes.row}
            key={index}
            ...
            >
    )

    The solution should be like this below:
    */

    const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            // Assume this component is existed
            // @ts-ignore
            <WalletRow
                // Assume the class is existed
                // @ts-ignore
                className={classes.row}
                key={`BC_${balance.currency}`} // This key is replaced with a better unique key
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });

    return <>{rows}</> // Return rows in a Fragment for better performance;
};

/*
--* PROBLEM 6 *--

This code piece is not being exported,
thus it will not be able to be used in other component.

The solution is to include:
*/
export default WalletPage;