import {Component} from "react";
import {Box, Flex, TextField, Text, Checkbox, Theme, Grid, Button,} from "@radix-ui/themes";


interface DragTitleProps{
    title: string;
}

export class DragTitle extends Component<DragTitleProps, any>{

    render() {
        return (<Text
            style={{
                // @ts-ignore
                "-webkit-app-region": "drag",
            }}
            className={'w-full flex items-center justify-center p-2 '}
        >
            {this.props.title}
        </Text>)
    }

}
