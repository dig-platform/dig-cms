import 'reflect-metadata';

// Register the decorator symbol
const formatMetadataKey = Symbol('Dig');

// Dig decorator that enables you to configure your component inputs
//
// ```typescript
// @Dig({
//   control: 'input',
//   type: 'text',
//   placeholder: 'Enter some text'
// })
// @Input() text = 'test this';
// ```

export const Dig = (config: any) => Reflect.metadata(formatMetadataKey, config);

// Gets the Dig configuration for the specified component input
//
// ```typescript
// const textConfig = digInput(component, 'text');
// ```

export const digInput = (target: any, propertyKey: string) => Reflect.getMetadata(formatMetadataKey, target, propertyKey);

// Gets the Dig configuration for a control
//
// ```typescript
// const textConfig = digInput(component, 'text');
// ```

export const digComponent = (target: any) => {
  if (target?.constructor.hasOwnProperty('propDecorators')) {
    return Object.keys(target.constructor.propDecorators)?.map(input => ({
      input,
      digProps: Reflect.getMetadata(formatMetadataKey, target, input)
    })).filter(input => !! input?.digProps);
  } else {
    return null;
  }
};

