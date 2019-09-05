// @flow
import {
  observable,
  action
} from 'mobx'

import wireService from './WireService';
import i18n from '../common/services/i18n.service';

export type PayloadType =
  | 'onchain'
  | 'offchain'
  | 'usd'
  | 'eth'
  | 'erc20'
  | 'btc';

/**
 * Wire store
 */
class WireStore {
  @observable currency = 'tokens';
  @observable amount = 1;
  @observable sending = false;
  @observable.shallow owner = null;
  @observable recurring = false;
  @observable showBtc = false;
  @observable loaded = false;
  @observable errors = [];

  @action
  setShowBtc = (value: boolean) => {
    this.showBtc = value;
  }

  @action
  setCurrency = (value: string) => {
    this.currency = value;

    // only tokens and usd can be recurring
    if (this.currency !== 'tokens' && this.currency !== 'usd') {
      this.recurring = false;
    }
    this.validate();
  }

  @action
  setAmount(val: number) {
    this.amount = val;
    this.validate();
  }

  @action
  setTier = (tier: any) => {
    this.amount = tier.amount;
    if (tier.currency) {
      this.setCurrency(tier.currency);
    } else {
      this.validate();
    }
  }

  @action
  setOwner(owner: any) {
    this.owner = owner;
  }

  async loadUserRewards(): Promise<any> {
    const owner = await wireService.userRewards(this.owner.guid);
    const { merchant, eth_wallet, wire_rewards, sums } = owner;

    if (this.owner) {
      this.owner.merchant = merchant;
      this.owner.eth_wallet = eth_wallet;
      this.owner.wire_rewards = wire_rewards;
      this.owner.sums = sums;
    }

    this.setLoaded(true);

    return owner;
  }

  @action
  setLoaded(value: boolean) {
    this.loaded = value;
  }

  round(number: number, precision: number): number {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  /**
   * Get formated amount
   */
  formatAmount(amount: number): string {
    return amount.toLocaleString('en-US') + ' tokens';
  }

  /**
   * Validate payment
   */
  @action
  validate() {
    this.errors = [];

    switch (this.currency) {
      case 'btc':
        if (this.owner && !this.owner.btc_address) {
          this.errors.push(i18n.t('wire.noBtcAddress'));
        }
        break;
    }

    if (this.amount <= 0) {
      this.errors.push(i18n.t('boosts.errorAmountSholdbePositive'));
    }
  }

  @action
  setRecurring(recurring: boolean) {
    this.recurring = !!recurring;
  }

  @action
  toggleRecurring() {
    this.recurring = !this.recurring;
  }

  /**
   * Confirm and Send wire
   */
  @action
  async send(): Promise<any> {
    if (this.sending) {
      return;
    }

    let done;

    // for btc we only show the btc component
    if (this.currency === 'btc') {
      return this.setShowBtc(true);
    }

    try {
      this.sending = true;

      done = await wireService.send({
        amount: this.amount,
        guid: this.guid,
        owner: this.owner,
        recurring: this.recurring,
        currency: this.currency
      });

      this.stopSending();
    } catch (e) {
      this.stopSending();
      throw e;
    }

    return done;
  }

  @action
  stopSending() {
    this.sending = false;
  }

  @action
  reset() {
    this.amount = 1;
    this.showBtc = false;
    this.currency = 'tokens';
    this.sending = false;
    this.owner = null;
    this.recurring = false;
    this.loaded = false;
    this.errors = [];
  }

}

export default WireStore;
