import Web3 from 'web3';
declare global {
    interface RouterParam {
        Component: NextComponentType<NextPageContext, any, any>;
        connected: boolean;
        connectMetamask: Function<Promise<boolean>> ;
        address : string;
        web3 : Web3 | undefined;
        balance: number;
        chainId: number;
        userId: string;
        disconnectMetamask: Function<>;
    }

    interface Window  {
        ethereum: any;
    }
}

export global {}