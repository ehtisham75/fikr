import * as LucideIcons from 'lucide-react-native'

const AppIcon = ({
    name,
    size = 20,
    color = 'white',
    style,
    ...props
}) => {
    const IconComponent = LucideIcons[name]

    if (!IconComponent) return null

    return (
        <IconComponent
            size={size}
            color={color}
            style={style}
            {...props}
        />
    )
}

export default AppIcon

