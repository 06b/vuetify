// Styles
import './VDatePickerControls.sass'

// Components
import { VBtn } from '@/components/VBtn'
import { VSpacer } from '@/components/VGrid'

// Composables
import { IconValue } from '@/composables/icons'
import { useLocale } from '@/composables/locale'

// Utilities
import { computed } from 'vue'
import { convertToUnit, genericComponent, propsFactory, useRender } from '@/util'

// Types
import type { PropType } from 'vue'

export const makeVDatePickerControlsProps = propsFactory({
  active: {
    type: [String, Array] as PropType<string | string[]>,
    default: undefined,
  },
  controlHeight: [Number, String],
  disabled: {
    type: [Boolean, String, Array] as PropType<boolean | string | string[] | null>,
    default: null,
  },
  nextIcon: {
    type: IconValue,
    default: '$next',
  },
  prevIcon: {
    type: IconValue,
    default: '$prev',
  },
  modeIcon: {
    type: IconValue,
    default: '$subgroup',
  },
  text: String,
  viewMode: {
    type: String as PropType<'month' | 'months' | 'year'>,
    default: 'month',
  },
}, 'VDatePickerControls')

export const VDatePickerControls = genericComponent()({
  name: 'VDatePickerControls',

  props: makeVDatePickerControlsProps(),

  emits: {
    'click:year': () => true,
    'click:month': () => true,
    'click:prev': () => true,
    'click:next': () => true,
    'click:text': () => true,
  },

  setup (props, { emit }) {
    const { t } = useLocale()

    const disableMonth = computed(() => {
      return Array.isArray(props.disabled)
        ? props.disabled.includes('text')
        : !!props.disabled
    })
    const disableYear = computed(() => {
      return Array.isArray(props.disabled)
        ? props.disabled.includes('mode')
        : !!props.disabled
    })
    const disablePrev = computed(() => {
      return Array.isArray(props.disabled)
        ? props.disabled.includes('prev')
        : !!props.disabled
    })
    const disableNext = computed(() => {
      return Array.isArray(props.disabled)
        ? props.disabled.includes('next')
        : !!props.disabled
    })

    function onClickPrev () {
      emit('click:prev')
    }

    function onClickNext () {
      emit('click:next')
    }

    function onClickYear () {
      emit('click:year')
    }

    function onClickMonth () {
      emit('click:month')
    }

    useRender(() => {
      // TODO: add slot support and scope defaults
      return (
        <div
          class={[
            'v-date-picker-controls',
          ]}
          style={{
            '--v-date-picker-controls-height': convertToUnit(props.controlHeight),
          }}
        >
          <VBtn
            class="v-date-picker-controls__month-btn"
            data-testid="month-btn"
            disabled={ disableMonth.value }
            text={ props.text }
            variant="text"
            rounded
            onClick={ onClickMonth }
          />

          <VBtn
            class="v-date-picker-controls__mode-btn"
            data-testid="year-btn"
            disabled={ disableYear.value }
            density="comfortable"
            icon={ props.modeIcon }
            variant="text"
            aria-label={ t('$vuetify.datePicker.ariaLabel.selectYear') }
            onClick={ onClickYear }
          />

          <VSpacer />

          <div class="v-date-picker-controls__month">
            <VBtn
              data-testid="prev-month"
              disabled={ disablePrev.value }
              density="comfortable"
              icon={ props.prevIcon }
              variant="text"
              aria-label={ t('$vuetify.datePicker.ariaLabel.previousMonth') }
              onClick={ onClickPrev }
            />

            <VBtn
              data-testid="next-month"
              disabled={ disableNext.value }
              icon={ props.nextIcon }
              density="comfortable"
              variant="text"
              aria-label={ t('$vuetify.datePicker.ariaLabel.nextMonth') }
              onClick={ onClickNext }
            />
          </div>
        </div>
      )
    })

    return {}
  },
})

export type VDatePickerControls = InstanceType<typeof VDatePickerControls>
