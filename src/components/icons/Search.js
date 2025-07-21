function SearchIcon(props) {
  const { stroke, width = 13, height = 11, ...restProps } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 13 11'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{ pointerEvents: 'none' }}
      {...restProps}
    >
      <circle
        cx='4.65744'
        cy='4.6575'
        r='3.76285'
        transform='rotate(16.0718 4.65744 4.6575)'
        stroke={stroke ?? 'white'}
        strokeWidth='0.5'
      />
      <path
        d='M7.92603 6.90448L12.2841 9.90045'
        stroke={stroke ?? 'white'}
        strokeWidth='0.5'
      />
    </svg>
  );
}

export default SearchIcon;
