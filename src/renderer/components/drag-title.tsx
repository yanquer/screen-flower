import {Component} from "react";
import {Box, Flex, TextField, Text, Checkbox, Theme, Grid, Button,} from "@radix-ui/themes";
import {Simulate} from "react-dom/test-utils";
import drag = Simulate.drag;


interface DragTitleProps{
    title: string;
}

export class DragTitle extends Component<DragTitleProps, any>{

    render() {
        return (<Text
            style={{
                // @ts-ignore
                // "-webkit-app-region": "drag",
                WebkitAppRegion: "drag",
            }}
            className={'w-full flex items-center justify-center p-2 select-none'}
        >
            {this.props.title}
        </Text>)
    }

}
