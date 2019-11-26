import deleteUser from "./helpers/deleteUser";

describe('Register Flow', () => {
  const username = 'e2euser' + ((Math.random() * 0xffffff) << 0).toString(16);
  const password = process.env.loginPass;

  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: {
        notifications: 'YES',
      },
    });
  });

  afterAll(async () => {
    deleteUser(username, password);
  });

  it('should register correctly', async () => {
    // login shoulf be visible
    await waitFor(element(by.id('usernameInput')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('registerButton')).tap();

    // email filed should be visible
    await waitFor(element(by.id('registerEmailInput')))
      .toBeVisible()
      .withTimeout(2000);

    // disable sync to prevent long waits for animations
    await device.disableSynchronization();

    // accept terms
    await element(by.id('checkbox')).atIndex(0).tapAtPoint({x:30, y:30});

    // fill the form
    await element(by.id('registerUsernameInput')).typeText(username);
    await element(by.id('registerEmailInput')).typeText('mye2e@minds.com');
    await element(by.id('registerPasswordInput')).typeText(password);
    await element(by.id('registerPasswordConfirmInput')).typeText(password);

    // press register
    await element(by.id('registerCreateButton')).tap();

    await device.enableSynchronization();
  });

});
