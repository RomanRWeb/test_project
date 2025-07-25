import '@ant-design/cssinjs';
import 'antd/es/theme/interface';

declare module 'antd/es/theme/interface' {
    export interface GlobalToken {
        myBgColor?: string;
    }
}
