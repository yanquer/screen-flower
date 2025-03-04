import {Box, Checkbox, Flex, Grid, Text, TextField} from "@radix-ui/themes";
import {ToolTipWrap} from "../tool-tip-wrap";
import {FormButton, IButtonProps} from "./form-button";
import {Logger} from "../../../common/logger";
import {ISettingService} from "../../../../common/service";
import {getServiceBySymbol} from "../../../../common/container/inject-container";
import {useState} from "react";

interface IFormItemProps {
    label: string;
    value: boolean;
    clickEvent: (val: boolean) => void;
}

export const FormItemCheckbox = (props: IFormItemProps) => {
    const {label, value, clickEvent} = props;

    const [checked, setChecked] = useState(value);

    return <Grid columns={"2"} gap="3"
                 className="bg-gray-600 p-1 rounded-lg"
    >

        {/* row1 */}
        <Box>
            <Text as="label" size="2">{label}</Text>
        </Box>

        <Box>
            <Flex className={"h-full"}
                  align={"center"}
                  // justify={"center"}
            >
                <Checkbox defaultChecked={false} color={'bronze'}
                          checked={value}
                          onClick={(e) => {
                              const _checked = !checked
                              setChecked(_checked);
                              clickEvent?.(_checked);
                          }}
                />
            </Flex>
        </Box>

    </Grid>
}

