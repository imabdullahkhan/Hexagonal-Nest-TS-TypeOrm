import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './CreateUserDto';
import { UpdateUserDto } from './UpdateUserDto';
import { DeleteUserDto } from './DeleteUserDto';
import { EventDto } from './EventDto';

export class KafkaServiceDto {
  @Type(() => EventDto, {
    discriminator: {
      property: 'eventType',
      subTypes: [
        { value: CreateUserDto, name: 'UserCreated' },
        { value: UpdateUserDto, name: 'UserUpdated' },
        { value: DeleteUserDto, name: 'UserDeleted' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ValidateNested()
  @IsNotEmpty()
  value: CreateUserDto | UpdateUserDto | DeleteUserDto;
}
