import Styled from 'styled-components';
import { PageHeader } from 'antd';

const CustomHeaderStyle = Styled(PageHeader)`
  .page-header-actions button.ant-btn-white svg {
    width: 12px;
    height: 12px;
    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 2px;
    color: #BD025D;
  }
  i +span, svg +span, img +span {
      ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 6px;
  }
`;

export { CustomHeaderStyle };
