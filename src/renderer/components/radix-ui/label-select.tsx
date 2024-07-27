import {Component} from "react";
import {Box, Select, Text} from "@radix-ui/themes";

interface LabelSelectProps{
    onChange: (value: string) => void;
    label: string;
    selectLabel: string;
    defaultValue?: string;
    options: {value: string, disabled?: boolean, text: string}[];
}

export class LabelSelect extends Component<LabelSelectProps, any>{

    render() {
        const {defaultValue, label, selectLabel,
            onChange, options} = this.props;
        return (
            <Box className={'flex items-center justify-center'}>
                <Text size={'2'} className={'pr-1 pl-1'} >{label}</Text>
                <Box className={'ml-2 mr-2'}  >

                    <Select.Root
                        size={'1'}
                        defaultValue={defaultValue}
                        onValueChange={(val) => onChange(val)}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>{selectLabel}</Select.Label>
                                {options.map(option => (
                                    <Select.Item
                                        value={option.value}
                                        disabled={option.disabled ?? false}
                                    >{option.text}</Select.Item>
                                ))}
                            </Select.Group>
                            {/*<Select.Separator />*/}
                            {/*<Select.Group>*/}
                            {/*    <Select.Label>Vide Size</Select.Label>*/}
                            {/*    <Select.Item value="HD">1920 x 1080</Select.Item>*/}
                            {/*</Select.Group>*/}
                        </Select.Content>
                    </Select.Root>
                </Box>
            </Box>
        )
    }
}