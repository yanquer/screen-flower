import {Box, Checkbox, Grid, Text, TextField} from "@radix-ui/themes";
import {ToolTipWrap} from "../tool-tip-wrap";
import {FormButton, IButtonProps} from "./form-button";

interface IFormItemProps {
    label: string;
    value: string;
    buttons?: Array<IButtonProps>;
}

export const FormItemInputText = (props: IFormItemProps) => {
    const {label, value, buttons} = props;

    return <Grid columns={"2"} gap="3"
                 className="bg-gray-600 p-1 rounded-lg"
    >

        <Box gridColumnStart={"1"}>
            <Text as="label" size="2">{label}</Text>
        </Box>
        <Box>
            {buttons?.map(val => <FormButton {...val}/>)}
        </Box>

        {/* input */}
        <Box gridColumn={"1 / span 2"}>
            <ToolTipWrap title={value} key={value}>
                <TextField.Root size="1"
                    // placeholder="…"
                                readOnly={true}
                                className={'overflow-x-auto overscroll-contain sm-scroll-bar'}
                                value={value}
                >
                    {/*    if icon*/}
                </TextField.Root>
            </ToolTipWrap>
        </Box>

    </Grid>
}

