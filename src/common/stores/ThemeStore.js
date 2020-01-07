import {observable, action} from 'mobx';
import {LIGHT_THEME, DARK_THEME} from '../../styles/Colors';

export default class ThemeStore {
  @observable theme = DARK_THEME;

  @action
  swithTheme() {
    this.theme = this.theme.name === LIGHT_THEME.name ? DARK_THEME : LIGHT_THEME;
  }
}
