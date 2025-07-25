// Components
import { VExpandTransition } from '@/components/transitions'
import { VDefaultsProvider } from '@/components/VDefaultsProvider'

// Composables
import { useList } from './list'
import { makeComponentProps } from '@/composables/component'
import { IconValue } from '@/composables/icons'
import { useNestedGroupActivator, useNestedItem } from '@/composables/nested/nested'
import { useSsrBoot } from '@/composables/ssrBoot'
import { makeTagProps } from '@/composables/tag'
import { MaybeTransition } from '@/composables/transition'

// Utilities
import { computed } from 'vue'
import { defineComponent, genericComponent, propsFactory, useRender } from '@/util'

export type VListGroupSlots = {
  default: never
  activator: { isOpen: boolean, props: Record<string, unknown> }
}

const VListGroupActivator = defineComponent({
  name: 'VListGroupActivator',

  setup (_, { slots }) {
    useNestedGroupActivator()

    return () => slots.default?.()
  },
})

export const makeVListGroupProps = propsFactory({
  /* @deprecated */
  activeColor: String,
  baseColor: String,
  color: String,
  collapseIcon: {
    type: IconValue,
    default: '$collapse',
  },
  disabled: Boolean,
  expandIcon: {
    type: IconValue,
    default: '$expand',
  },
  rawId: [String, Number],
  prependIcon: IconValue,
  appendIcon: IconValue,
  fluid: Boolean,
  subgroup: Boolean,
  title: String,
  value: null,

  ...makeComponentProps(),
  ...makeTagProps(),
}, 'VListGroup')

export const VListGroup = genericComponent<VListGroupSlots>()({
  name: 'VListGroup',

  props: makeVListGroupProps(),

  setup (props, { slots }) {
    const { isOpen, open, id: _id } = useNestedItem(() => props.value, () => props.disabled, true)
    const id = computed(() => `v-list-group--id-${String(props.rawId ?? _id.value)}`)
    const list = useList()
    const { isBooted } = useSsrBoot()

    function onClick (e: Event) {
      if (['INPUT', 'TEXTAREA'].includes((e.target as Element)?.tagName)) return
      open(!isOpen.value, e)
    }

    const activatorProps = computed(() => ({
      onClick,
      class: 'v-list-group__header',
      id: id.value,
    }))

    const toggleIcon = computed(() => isOpen.value ? props.collapseIcon : props.expandIcon)
    const activatorDefaults = computed(() => ({
      VListItem: {
        activeColor: props.activeColor,
        baseColor: props.baseColor,
        color: props.color,
        prependIcon: props.prependIcon || (props.subgroup && toggleIcon.value),
        appendIcon: props.appendIcon || (!props.subgroup && toggleIcon.value),
        title: props.title,
        value: props.value,
      },
    }))

    useRender(() => (
      <props.tag
        class={[
          'v-list-group',
          {
            'v-list-group--prepend': list?.hasPrepend.value,
            'v-list-group--fluid': props.fluid,
            'v-list-group--subgroup': props.subgroup,
            'v-list-group--open': isOpen.value,
          },
          props.class,
        ]}
        style={ props.style }
      >
        { slots.activator && (
          <VDefaultsProvider defaults={ activatorDefaults.value }>
            <VListGroupActivator>
              { slots.activator({ props: activatorProps.value, isOpen: isOpen.value }) }
            </VListGroupActivator>
          </VDefaultsProvider>
        )}

        <MaybeTransition transition={{ component: VExpandTransition }} disabled={ !isBooted.value }>
          <div class="v-list-group__items" role="group" aria-labelledby={ id.value } v-show={ isOpen.value }>
            { slots.default?.() }
          </div>
        </MaybeTransition>
      </props.tag>
    ))

    return {
      isOpen,
    }
  },
})

export type VListGroup = InstanceType<typeof VListGroup>
