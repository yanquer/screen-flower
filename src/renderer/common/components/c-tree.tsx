import {Component} from "react";
import Tree from 'rc-tree'
import "rc-tree/assets/index.css"


export class CTree extends Component<any, any>{
    render() {
        return (<Tree
            defaultExpandedKeys={['0-0']}
            treeData={[
                {
                    title: 'This is the title for the first node',
                    key: '0-0',
                    children: [
                        {
                            key: '0-0-0',
                            isLeaf: true,
                            title: 'This is the title for the second node, with a tooltip on hover'
                        },
                        {
                            key: '0-0-1',
                            isLeaf: true,
                            title: 'This is the title for the third node, with a tooltip on hover'
                        }
                    ]
                },
                {
                    key: '0-1',
                    isLeaf: true,
                    title: 'This is the title for the fourth node, with a tooltip on hover'
                }
            ]}
        />);
    }
}
