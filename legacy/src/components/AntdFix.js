// This file re-exports Ant Design components to fix import issues
// It uses CommonJS imports instead of ES modules to avoid ESM compatibility issues

const antd = require('antd');

// Export specific components that are used in the application
export const { 
  Breadcrumb, 
  Button,
  Carousel,
  Checkbox,
  Col, 
  Collapse,
  Drawer,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Typography
} = antd;

// Export other specific components as needed
export default antd;