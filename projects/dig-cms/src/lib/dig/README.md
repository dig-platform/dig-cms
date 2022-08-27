Dig
===

Dig is our core library that enables us to bind the required configuration to the component inputs.

Dig() Decorator
---------------

The core of Dig is the `Dig()` decorator. This decorator enables you to pass Dig configuration
from your component inputs.

```typescript
export class TextComponent implements OnInit {
  @Dig({
    type: 'text',
    placeholder: 'Enter some text'
  })
  @Input() text = 'test this';
  // ...
```

digInput()
----------

`digInput()` enables you to fetch the Dig configuration from a component's input.

```typescript
const component: TextComponent = await getYourTextComponentInstance();
const textConfig = digInput(component, 'text');
// {
//   "type": "text",
//   "placeholder": "Enter some text"
// }
```

digComponent() 
--------------

`digInput()` enables you to fetch the Dig configuration from all the inputs in the component
that are decorated with `Dig(...)`.

```typescript
const component: TextComponent = await getYourTextComponentInstance();
const inputs = digComponent(component);
// [
//     {
//         "input": "text",
//         "digProps": {
//             "type": "text",
//             "placeholder": "Enter some text"
//         }
//     },
//     {
//         "input": "description",
//         "digProps": {
//             "type": "text",
//             "rows": 2,
//             "placeholder": "Enter a description"
//         }
//     }
// ]
```
