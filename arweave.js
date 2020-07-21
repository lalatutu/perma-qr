var ar = {
    init: async function () {
        this.arweave = Arweave.init();
        this.arweave.network.getInfo().then(console.log);
        return 'init done';
    },
    arweave: 'hello',
    loggedIn: false,
    jwk: false,
    address: false,
    balance: false,
    getAddress: function () {
        return this.address;
    },
    login: async function (jwk) {
        this.jwk = jwk;
        try {
            if (typeof beforeLogin === 'function') beforeLogin();
            this.arweave.wallets.jwkToAddress(jwk).then((address) => {
                this.address = address;
                this.loggedIn = true;

                // get balance
                this.arweave.wallets.getBalance(address).then((balance) => {
                    let winston = balance;
                    let _ar = this.arweave.ar.winstonToAr(balance);
                    this.balance = {
                        winston: winston,
                        ar: _ar,
                    };
                    if (typeof onLoginSuccess === 'function') onLoginSuccess();
                });
            });
        } catch (e) {
            if (typeof onLoginError === 'function') onLoginError(e);
        }
    },
    hasLogin: function () {
        return this.loggedIn;
    },
    getBalance: function () {
        return this.balance;
    },
    submitTx: async function (data, tag_obj) {
        if (!this.hasLogin()) throw ('You need login first');
        let tx = await this.arweave.createTransaction({
            data: data,
        }, this.jwk);
        $.each(tag_obj, function (key, value) {
            tx.addTag(key, value);
        });
        await this.arweave.transactions.sign(tx, this.jwk);
        return await this.arweave.transactions.post(tx);
    },
    getTxStatus: function (txId) {
        this.arweave.transactions.getStatus(txId).then(status => {
            return status;
        })
    },
    getTx: function (txId) {
        const transaction = this.arweave.transactions.get(txId).then(transaction => {
            return transaction;
        });
    },
    getLastTx: function () {
        if (!this.hasLogin()) throw ('You need login first');
        this.arweave.wallets.getLastTransactionID(address).then((transactionId) => {
            return transactionId;
        });
    },
};