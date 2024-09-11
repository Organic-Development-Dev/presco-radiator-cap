import { useEffect, useState } from 'react';
import { fetchAttributesWithTermByCategoryId } from '../utils/products';
import { Button, Checkbox, Drawer, Space, Select } from 'antd';
import CloseIcon from './icons/Close';
import dynamic from 'next/dynamic';

const { Option } = Select;

const DrawerFilterProduct = (props) => {
  const { open, onClose, handlerFilter, products } = props;
  const [dataAttributes, setDataAttributes] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortOrder, setSortOrder] = useState('ascending'); // Manage sort order state

  useEffect(() => {
    if (products?.length > 0) {
      const dataAttrRes = fetchAttributesWithTermByCategoryId(products);
      setDataAttributes(dataAttrRes);
    }
  }, [products]);

  const handleCheckboxChange = (attribute, value, checked) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[attribute] || [];
      if (checked) {
        return { ...prev, [attribute]: [...currentValues, value] };
      } else {
        const updatedValues = currentValues.filter((v) => v !== value);
        if (updatedValues.length === 0) {
          const { [attribute]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [attribute]: updatedValues };
      }
    });
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  const handleFilterClick = () => {
    handlerFilter(selectedFilters, sortOrder); // Pass sortOrder to the handlerFilter function
  };

  return (
    <Drawer
      width={360}
      onClose={onClose}
      closeIcon={
        <div
          className='p-1 rounded-lg'
          style={{ backgroundColor: 'var(--primary-color)', right: 0 }}
        >
          <CloseIcon fill='#fff' width={20} height={20} />
        </div>
      }
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleFilterClick} type='primary'>
            Filter
          </Button>
        </Space>
      }
      open={open}
      placement='left'
    >
      <div
        style={{
          borderTop: '8px solid var(--primary-color)',
          backgroundColor: '#F0F0F0',
          padding: '16px 24px',
          marginBottom: 24,
        }}
      >
        <div
          style={{ color: 'var(--primary-color)' }}
          className='pb-2 text-2xl font-semibold uppercase'
        >
          Sort Order
        </div>
        <Select
          value={sortOrder}
          onChange={handleSortOrderChange}
          style={{ width: 200 }}
        >
          <Option value='ascending'>Ascending</Option>
          <Option value='descending'>Descending</Option>
        </Select>
      </div>

      {Object.entries(dataAttributes).map(([attribute, terms]) => (
        <div
          key={attribute}
          style={{
            borderTop: '8px solid var(--primary-color)',
            backgroundColor: '#F0F0F0',
            padding: '16px 24px',
            marginBottom: 24,
          }}
        >
          <div
            style={{ color: 'var(--primary-color)' }}
            className='pb-2 text-2xl font-semibold uppercase'
          >
            {attribute}
          </div>
          <Checkbox.Group
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: 10,
            }}
          >
            {terms.map((term) => (
              <Checkbox
                key={term}
                onChange={(e) =>
                  handleCheckboxChange(attribute, term, e.target.checked)
                }
                value={term}
              >
                <div className='flex justify-between' style={{ width: 200 }}>
                  <span>{term}</span>
                </div>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      ))}
    </Drawer>
  );
};

export default DrawerFilterProduct;
