import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Calculator } from './calculator';

describe('Calculator', () => {
  test('should display default values', () => {
    const { container } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <Calculator showPresets={false} onPresetPopulate={() => {}} />,
    );
    expect(container.textContent).toMatch('Current value: 5');
  });

  // test('should increment after "Increment" button is clicked', async () => {
  //   render(<Counter initialCount={5}/>);
  //
  //   fireEvent.click(screen.getByText('Increment'));
  //   await waitFor(() => {
  //     // .toBeInTheDocument() is an assertion that comes from jest-dom.
  //     // Otherwise you could use .toBeDefined().
  //     expect(screen.getByText("Current value: 6")).toBeInTheDocument();
  //   });
  // });
});
