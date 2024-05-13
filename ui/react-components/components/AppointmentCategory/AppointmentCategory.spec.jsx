import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import AppointmentCategory from './AppointmentCategory';
import { IntlProvider } from 'react-intl';

describe('AppointmentCategory', () => {
  const mockProps = {
    intl: {
        formatMessage: jest.fn().mockReturnValue('Appointment category'),
    },
    onChange: jest.fn(),
    value: '',
    isDisabled: false,
    specialityEnabled: false,
    autoFocus: false,
    priorityOptionsList: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
    ],
    isRequired: false,
  };

  it('renders without crashing', () => {
    render(<IntlProvider locale="en"><AppointmentCategory {...mockProps} /></IntlProvider>);
  });

  it('renders title with placeholder text', () => {
    const { getByText } = render(<IntlProvider locale="en"><AppointmentCategory {...mockProps} /></IntlProvider>);
    expect(getByText('Appointment category')).toBeTruthy();
  });

  it('renders ComboBox with placeholder', () => {
    const { getByPlaceholderText } = render(<IntlProvider locale="en"><AppointmentCategory {...mockProps} /></IntlProvider>);
    expect(getByPlaceholderText('Choose an option')).toBeTruthy();
  });

  it('renders ComboBox with priorityOptionsList items', () => {
    const { getByPlaceholderText, getByText } = render(<IntlProvider locale="en"><AppointmentCategory {...mockProps} /></IntlProvider>);
    fireEvent.click(getByPlaceholderText('Choose an option'));
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('filters items based on input value', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<IntlProvider locale="en"><AppointmentCategory {...mockProps} /></IntlProvider>);
    fireEvent.change(getByPlaceholderText('Choose an option'), { target: { value: 'Option 1' } });
    expect(getByText('Option 1')).toBeTruthy();
    expect(queryByText('Option 2')).not.toBeTruthy();
    fireEvent.change(getByPlaceholderText('Choose an option'), { target: { value: 'Option 2' } });
    expect(getByText('Option 2')).toBeTruthy();
    expect(queryByText('Option 1')).not.toBeTruthy();
  });
});
