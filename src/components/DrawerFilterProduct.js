import { useEffect, useState } from 'react';
import { fetchAttributesWithTermByCategoryId } from '../utils/products';
import { Button, Checkbox, Drawer, Space } from 'antd';
import CloseIcon from './icons/Close';

const DrawerFilterProduct = (props) => {
  const { open, onClose, handlerFilter, categoryId } = props;
  const [dataAttributes, setDataAttributes] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  // useEffect(() => {
  //   (async () => {
  //     const dataAttributesRes = await fetchAttributesWithTerm();
  //     setDataAttributes(dataAttributesRes);
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const dataAttrRes = await fetchAttributesWithTermByCategoryId(categoryId);
      setDataAttributes(dataAttrRes);
    })();
  }, [categoryId]);

  const handleCheckboxChange = (attribute, value, checked) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[attribute] || [];
      if (checked) {
        // Thêm giá trị nếu người dùng đánh dấu chọn
        return { ...prev, [attribute]: [...currentValues, value] };
      } else {
        // Xóa giá trị nếu người dùng bỏ đánh dấu
        const updatedValues = currentValues.filter((v) => v !== value);
        // Nếu sau khi bỏ chọn, mảng trống, thì xóa key đó khỏi đối tượng
        if (updatedValues.length === 0) {
          const { [attribute]: _, ...rest } = prev;
          return rest;
        }
        // Ngược lại, cập nhật giá trị mới cho key
        return { ...prev, [attribute]: updatedValues };
      }
    });
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
          <Button>Cancel</Button>
          <Button onClick={() => handlerFilter(selectedFilters)} type='primary'>
            Filter
          </Button>
        </Space>
      }
      open={open}
      placement='left'
    >
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
      {/* {dataAttributes.map((att) => (
        <div
          key={att.id}
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
            {att.name}
          </div>
          <Checkbox.Group
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: 10,
            }}
          >
            {att.terms.map((term) => (
              <Checkbox
                checked={
                  selectedFilters[att.name] &&
                  selectedFilters[att.name].includes(term.slug)
                }
                onChange={(e) =>
                  handleCheckboxChange(att.name, term.name, e.target.checked)
                }
                value={term.slug}
              >
                <div className='flex justify-between' style={{ width: 200 }}>
                  <span>{term.name}</span>
                </div>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      ))} */}
    </Drawer>
  );
};

export default DrawerFilterProduct;
