import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import { colors } from '../constants/Colors.ts';

export default function RoutingBtn(props) {
        const bgColor = props.isSecondary ? colors.secondary : colors.primary;
        const style = StyleSheet.create({
            btn: {
                backgroundColor: bgColor,
                color: "#fff",
                padding: "10",
                height: "100",
                width: "200",
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 30,
                fontWeight: 'bold',
            }
        });

        return (
                <TouchableHighlight onPress={props.onPress}>
                    <Text style={style.btn}>
                        {props.title}
                    </Text>
                </TouchableHighlight>
            );
    }
