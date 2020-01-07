import React, {Component} from 'react';
import {CommonStyle} from '../../styles/Common';
import styled, {ThemeProvider} from 'styled-components';

import {inject, observer} from 'mobx-react/native'

@inject('theme')
@observer
export default class MindsLayout extends Component {
  render() {
    const bodyBackground = this.props.bodyBackground ? this.props.bodyBackground : null,
      footerBackground = this.props.footerBackground ? this.props.footerBackground : null,
      theme = this.props.theme.theme;
    
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Body backgroundColor={bodyBackground}>
            {this.props.body}
          </Body>
          <Footer backgroundColor={footerBackground}>
            {this.props.footer}
          </Footer>
        </Container>
      </ThemeProvider>
    );
  }
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
`;

const Body = styled.View`
  flex: 9;
  flex-direction: row;
	justify-content: center;
  background-color: ${(props) => props.theme[props.backgroundColor] || props.theme['primary_background']};
  padding: 20px 20px 10px 20px;
`;

const Footer = styled.View`
  flex: 3;
  flex-direction: row;
  justify-content: center;
  background-color: ${(props) => props.theme[props.backgroundColor] || props.theme['primary_background']};
  padding: 20px 20px 10px 20px;
`;
