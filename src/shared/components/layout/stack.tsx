import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

export type FlexAlignType = NonNullable<ViewStyle['alignItems']>;
export type FlexJustifyType = NonNullable<ViewStyle['justifyContent']>;

import { spacing } from '@/shared/theme';

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = SpacingKey | number;

/**
 * Resolves a spacing token key or pixel number to a concrete numeric spacing value.
 */
export function resolveSpacing(val?: SpacingValue): number | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'number') {
    if (val in spacing) {
      return spacing[val as SpacingKey];
    }
    return val;
  }
  return undefined;
}

export interface StackProps extends ViewProps {
  /** Flex direction: 'column' | 'row' | 'column-reverse' | 'row-reverse'. Defaults to 'column'. */
  direction?: ViewStyle['flexDirection'];
  /** Tokenized gap between children (from spacing tokens or numeric pixels) */
  gap?: SpacingValue;
  /** Cross-axis alignment (alignItems) */
  align?: FlexAlignType;
  /** Main-axis alignment (justifyContent) */
  justify?: ViewStyle['justifyContent'];
  /** Flex wrap behavior */
  wrap?: ViewStyle['flexWrap'];
  /** Flex growth / shrink factor */
  flex?: number;

  /** Tokenized padding applied to all sides */
  padding?: SpacingValue;
  /** Tokenized horizontal padding */
  paddingHorizontal?: SpacingValue;
  /** Tokenized vertical padding */
  paddingVertical?: SpacingValue;
  /** Tokenized top padding */
  paddingTop?: SpacingValue;
  /** Tokenized bottom padding */
  paddingBottom?: SpacingValue;
  /** Tokenized left padding */
  paddingLeft?: SpacingValue;
  /** Tokenized right padding */
  paddingRight?: SpacingValue;

  /** Short alias for padding */
  p?: SpacingValue;
  /** Short alias for paddingHorizontal */
  px?: SpacingValue;
  /** Short alias for paddingVertical */
  py?: SpacingValue;
  /** Short alias for paddingTop */
  pt?: SpacingValue;
  /** Short alias for paddingBottom */
  pb?: SpacingValue;
  /** Short alias for paddingLeft */
  pl?: SpacingValue;
  /** Short alias for paddingRight */
  pr?: SpacingValue;

  /** Tokenized margin applied to all sides */
  margin?: SpacingValue;
  /** Tokenized horizontal margin */
  marginHorizontal?: SpacingValue;
  /** Tokenized vertical margin */
  marginVertical?: SpacingValue;
  /** Tokenized top margin */
  marginTop?: SpacingValue;
  /** Tokenized bottom margin */
  marginBottom?: SpacingValue;
  /** Tokenized left margin */
  marginLeft?: SpacingValue;
  /** Tokenized right margin */
  marginRight?: SpacingValue;

  /** Short alias for margin */
  m?: SpacingValue;
  /** Short alias for marginHorizontal */
  mx?: SpacingValue;
  /** Short alias for marginVertical */
  my?: SpacingValue;
  /** Short alias for marginTop */
  mt?: SpacingValue;
  /** Short alias for marginBottom */
  mb?: SpacingValue;
  /** Short alias for marginLeft */
  ml?: SpacingValue;
  /** Short alias for marginRight */
  mr?: SpacingValue;
}

const staticStyles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  columnReverse: {
    flexDirection: 'column-reverse',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
});

export const Stack = React.forwardRef<React.ComponentRef<typeof View>, StackProps>(
  (
    {
      direction = 'column',
      gap,
      align,
      justify,
      wrap,
      flex,
      padding,
      paddingHorizontal,
      paddingVertical,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      margin,
      marginHorizontal,
      marginVertical,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      style,
      children,
      ...restProps
    },
    ref,
  ) => {
    const computedDynamicStyle = useMemo<ViewStyle>(() => {
      const dynamic: Record<string, any> = {};

      if (align !== undefined) dynamic.alignItems = align;
      if (justify !== undefined) dynamic.justifyContent = justify;
      if (wrap !== undefined) dynamic.flexWrap = wrap;
      if (flex !== undefined) dynamic.flex = flex;

      const resolvedGap = resolveSpacing(gap);
      if (resolvedGap !== undefined) dynamic.gap = resolvedGap;

      const resolvedP = resolveSpacing(p ?? padding);
      if (resolvedP !== undefined) dynamic.padding = resolvedP;
      const resolvedPx = resolveSpacing(px ?? paddingHorizontal);
      if (resolvedPx !== undefined) dynamic.paddingHorizontal = resolvedPx;
      const resolvedPy = resolveSpacing(py ?? paddingVertical);
      if (resolvedPy !== undefined) dynamic.paddingVertical = resolvedPy;
      const resolvedPt = resolveSpacing(pt ?? paddingTop);
      if (resolvedPt !== undefined) dynamic.paddingTop = resolvedPt;
      const resolvedPb = resolveSpacing(pb ?? paddingBottom);
      if (resolvedPb !== undefined) dynamic.paddingBottom = resolvedPb;
      const resolvedPl = resolveSpacing(pl ?? paddingLeft);
      if (resolvedPl !== undefined) dynamic.paddingLeft = resolvedPl;
      const resolvedPr = resolveSpacing(pr ?? paddingRight);
      if (resolvedPr !== undefined) dynamic.paddingRight = resolvedPr;

      const resolvedM = resolveSpacing(m ?? margin);
      if (resolvedM !== undefined) dynamic.margin = resolvedM;
      const resolvedMx = resolveSpacing(mx ?? marginHorizontal);
      if (resolvedMx !== undefined) dynamic.marginHorizontal = resolvedMx;
      const resolvedMy = resolveSpacing(my ?? marginVertical);
      if (resolvedMy !== undefined) dynamic.marginVertical = resolvedMy;
      const resolvedMt = resolveSpacing(mt ?? marginTop);
      if (resolvedMt !== undefined) dynamic.marginTop = resolvedMt;
      const resolvedMb = resolveSpacing(mb ?? marginBottom);
      if (resolvedMb !== undefined) dynamic.marginBottom = resolvedMb;
      const resolvedMl = resolveSpacing(ml ?? marginLeft);
      if (resolvedMl !== undefined) dynamic.marginLeft = resolvedMl;
      const resolvedMr = resolveSpacing(mr ?? marginRight);
      if (resolvedMr !== undefined) dynamic.marginRight = resolvedMr;

      return dynamic;
    }, [
      align,
      justify,
      wrap,
      flex,
      gap,
      p,
      padding,
      px,
      paddingHorizontal,
      py,
      paddingVertical,
      pt,
      paddingTop,
      pb,
      paddingBottom,
      pl,
      paddingLeft,
      pr,
      paddingRight,
      m,
      margin,
      mx,
      marginHorizontal,
      my,
      marginVertical,
      mt,
      marginTop,
      mb,
      marginBottom,
      ml,
      marginLeft,
      mr,
      marginRight,
    ]);

    const directionStyle =
      direction === 'row'
        ? staticStyles.row
        : direction === 'column-reverse'
          ? staticStyles.columnReverse
          : direction === 'row-reverse'
            ? staticStyles.rowReverse
            : staticStyles.column;

    return (
      <View ref={ref} style={[directionStyle, computedDynamicStyle, style]} {...restProps}>
        {children}
      </View>
    );
  },
);

Stack.displayName = 'Stack';

export type VStackProps = Omit<StackProps, 'direction'>;

/**
 * Vertical flexbox stack with tokenized gap and padding.
 */
export const VStack = React.forwardRef<React.ComponentRef<typeof View>, VStackProps>(
  (props, ref) => <Stack ref={ref} direction="column" {...props} />,
);

VStack.displayName = 'VStack';

export type HStackProps = Omit<StackProps, 'direction'>;

/**
 * Horizontal flexbox stack with tokenized gap and padding.
 */
export const HStack = React.forwardRef<React.ComponentRef<typeof View>, HStackProps>(
  (props, ref) => <Stack ref={ref} direction="row" {...props} />,
);

HStack.displayName = 'HStack';
