import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

export type ListProps<ItemT> = FlatListProps<ItemT>;

const ListComponent = React.forwardRef(function List<ItemT>(
    props: ListProps<ItemT>,
    ref: React.ForwardedRef<FlatList<ItemT>>
) {
    return <FlatList ref={ref} {...props} />;
}) as <ItemT>(props: ListProps<ItemT> & { ref?: React.ForwardedRef<FlatList<ItemT>> }) => React.ReactElement;

export const List = ListComponent as typeof ListComponent & { displayName: string };
List.displayName = 'List';