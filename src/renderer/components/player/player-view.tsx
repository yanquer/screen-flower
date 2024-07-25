import {Component} from "react";
import {Box, Flex, TextField, Text, Checkbox, Theme, Grid, Button} from "@radix-ui/themes";
import {VideoPlayer} from "./video-player";
import {DragTitle} from "../drag-title";


export class PlayerView extends Component<any, any>{

    render() {
        return (
            <div className={'w-screen h-screen flex items-center justify-center overflow-hidden bg-gray-500'}>
                <Theme appearance={'dark'}
                       className={"p-4 pt-1 bg-gray-800"}
                >
                    <DragTitle title={'player'}/>
                    <Box>
                        <VideoPlayer/>
                    </Box>
                </Theme>
            </div>
        );
    }

}
