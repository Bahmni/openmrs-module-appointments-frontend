import React, {useState} from 'react';
import ToggleButton from '../components/ToggleButton/ToggleButton';

export default { title: 'ToggleButton' };

export const basic = () => (<ToggleButton></ToggleButton>);

export const disabled = () => (<ToggleButton disabled></ToggleButton>);

export const alwaysChecked = () => (<ToggleButton checked></ToggleButton>);

export const example = () => {
    const [showMe, setValue] = useState(false);
    return (
      <div className="app">
        <ToggleButton
          checked={showMe}
          handleToggle={() => setValue(!showMe)}
        >
        </ToggleButton>
        {showMe &&
            <div style={{padding: '50px'}}>
                Now you see me!
            </div>
        }
      </div>
    );
};

